import { Request, Response } from 'express';
import db from '../config/database';

// Get all destinations
export const getDestinations = async (req: Request, res: Response) => {
  try {
    const { country, cost, limit = '20' } = req.query;
    
    let query = 'SELECT * FROM destinations WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (country) {
      query += ` AND country = $${paramIndex++}`;
      params.push(country);
    }

    if (cost) {
      query += ` AND average_cost = $${paramIndex++}`;
      params.push(cost);
    }

    query += ` ORDER BY rating DESC LIMIT $${paramIndex}`;
    params.push(parseInt(limit as string));

    const [destinations]: any = await db.query(query, params);

    // Get tags for each destination
    for (const dest of destinations) {
      const [tags]: any = await db.query(
        'SELECT tag FROM destination_tags WHERE destination_id = $1',
        [dest.id]
      );
      dest.tags = tags.map((t: any) => t.tag);

      const [activities]: any = await db.query(
        `SELECT a.name FROM activities a
         INNER JOIN destination_activities da ON a.id = da.activity_id
         WHERE da.destination_id = $1
         ORDER BY da.popularity_score DESC`,
        [dest.id]
      );
      dest.popularActivities = activities.map((a: any) => a.name);
    }

    res.json({
      success: true,
      destinations
    });
  } catch (error: any) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get destinations'
    });
  }
};

// Get destination by ID
export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const { destinationId } = req.params;

    const [destinations]: any = await db.query(
      'SELECT * FROM destinations WHERE id = $1',
      [destinationId]
    );

    if (destinations.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    const destination = destinations[0];

    // Get tags
    const [tags]: any = await db.query(
      'SELECT tag FROM destination_tags WHERE destination_id = $1',
      [destinationId]
    );
    destination.tags = tags.map((t: any) => t.tag);

    // Get activities
    const [activities]: any = await db.query(
      `SELECT a.name FROM activities a
       INNER JOIN destination_activities da ON a.id = da.activity_id
       WHERE da.destination_id = $1
       ORDER BY da.popularity_score DESC`,
      [destinationId]
    );
    destination.popularActivities = activities.map((a: any) => a.name);

    res.json({
      success: true,
      destination
    });
  } catch (error: any) {
    console.error('Get destination error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get destination'
    });
  }
};

// Search destinations
export const searchDestinations = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const [destinations]: any = await db.query(
      `SELECT * FROM destinations 
       WHERE name ILIKE $1 OR country ILIKE $2 OR description ILIKE $3
       ORDER BY rating DESC LIMIT 10`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    res.json({
      success: true,
      destinations
    });
  } catch (error: any) {
    console.error('Search destinations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search destinations'
    });
  }
};
