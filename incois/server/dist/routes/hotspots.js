"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    // Simple density hotspots via ST_ClusterDBSCAN centroids + convex hull per cluster
    const { bbox, threshold = '0.5' } = req.query;
    const where = [];
    const params = [];
    if (bbox) {
        const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number);
        params.push(minLng, minLat, maxLng, maxLat);
        where.push('geom && ST_MakeEnvelope($' + (params.length - 3) + ', $' + (params.length - 2) + ', $' + (params.length - 1) + ', $' + params.length + ', 4326)');
    }
    const sql = `WITH pts AS (
                 SELECT id, geom FROM reports ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
               ),
               clusters AS (
                 SELECT ST_ClusterDBSCAN(geom, eps := 0.05, minpoints := 3) OVER () AS cid, geom
                 FROM pts
               ),
               hulls AS (
                 SELECT cid, ST_ConvexHull(ST_Collect(geom)) AS hull, COUNT(*) as report_count
                 FROM clusters WHERE cid IS NOT NULL GROUP BY cid
               )
               SELECT ST_AsGeoJSON(hull) AS geojson, report_count FROM hulls WHERE report_count > 2`;
    const { rows } = await (0, db_1.query)(sql, params);
    const result = rows.map((r, idx) => ({ id: `h_${idx}`, polygon: JSON.parse(r.geojson), score: Math.min(1, r.report_count / 20), createdAt: new Date().toISOString(), relatedReports: [] }));
    return res.json(result);
});
exports.default = router;
