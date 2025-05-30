import { Request, Response } from 'express';
import { Property, IProperty } from '../models/property.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import redisService from '../services/redis.service';

// Create a new property
export const createProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const propertyData = {
      ...req.body,
      createdBy: req.user?.id,
    };

    const property = await Property.create(propertyData);
    
    // Invalidate all property caches when a new property is created
    await redisService.invalidateAllPropertyCaches();

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//advance filtering techniques
export const getPropertiesbySearch = async (req: Request, res: Response) => {
  try {
    const queryString = JSON.stringify(req.query);
    
    // Try to get cached results first
    const cachedResults = await redisService.getCachedSearchResults(queryString);
    if (cachedResults) {
      return res.status(200).json({
        success: true,
        count: cachedResults.length,
        data: cachedResults,
        fromCache: true,
      });
    }

    const {
      type,
      minPrice,
      maxPrice,
      state,
      city,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      amenities,
      furnished,
      availableFrom,
      listedBy,
      tags,
      colorTheme,
      minRating,
      isVerified,
      listingType,
    } = req.query;

    const query: any = {};

    if (type) query.type = type;
    if (state) query.state = state;
    if (city) query.city = city;
    if (furnished) query.furnished = furnished;
    if (listedBy) query.listedBy = listedBy;
    if (colorTheme) query.colorTheme = colorTheme;
    if (listingType) query.listingType = listingType;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';

    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      query.areaSqFt = {};
      if (minArea) query.areaSqFt.$gte = Number(minArea);
      if (maxArea) query.areaSqFt.$lte = Number(maxArea);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (availableFrom) {
      query.availableFrom = { $lte: new Date(availableFrom as string) };
    }

    if (amenities) {
      const amenityArray = Array.isArray(amenities)
        ? amenities
        : (amenities as string).split(',');
      query.amenities = { $all: amenityArray };
    }

    if (tags) {
      const tagArray = Array.isArray(tags)
        ? tags
        : (tags as string).split(',');
      query.tags = { $all: tagArray };
    }

    const properties = await Property.find(query).populate('createdBy', 'name email');

    // Cache the search results
    await redisService.cacheSearchResults(queryString, properties);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
      fromCache: false,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all properties
export const getProperties = async (req: Request, res: Response) => {
  try {
    // Try to get cached properties first
    const cachedProperties = await redisService.getCachedPropertyList();
    if (cachedProperties) {
      return res.status(200).json({
        success: true,
        count: cachedProperties.length,
        data: cachedProperties,
        fromCache: true,
      });
    }

    const properties = await Property.find().populate('createdBy', 'name email');

    // Cache the properties
    await redisService.cachePropertyList(properties);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
      fromCache: false,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get property by ID
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    // Try to get cached property first
    const cachedProperty = await redisService.getCachedPropertyDetail(req.params.id);
    if (cachedProperty) {
      return res.status(200).json({
        success: true,
        data: cachedProperty,
        fromCache: true,
      });
    }

    const property = await Property.findOne({ id: req.params.id }).populate('createdBy', 'name email');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Cache the property
    await redisService.cachePropertyDetail(req.params.id, property);

    res.status(200).json({
      success: true,
      data: property,
      fromCache: false,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update property
export const updateProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let property = await Property.findOne({ id: req.params.id });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check if user is the creator of the property
    if (property.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property',
      });
    }

    property = await Property.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    // Invalidate cache for this property
    await redisService.invalidatePropertyCache(req.params.id);

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete property
export const deleteProperty = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let property = await Property.findOne({ id: req.params.id });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check if user is the creator of the property
    if (property.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property',
      });
    }

    await property.deleteOne();

    // Invalidate cache for this property
    await redisService.invalidatePropertyCache(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}; 