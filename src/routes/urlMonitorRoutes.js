// Replace require statements with import
import express from 'express';
import { addUrl, removeUrl, listUrls } from '../services/urlMonitorService.js';

const router = express.Router();

router.post('/add', (req, res) => {
    const { url, checkMethod } = req.body;
    const result = addUrl(url, checkMethod);
    res.json(result);
});

router.post('/delete', (req, res) => {
    const { uniqueId } = req.body;
    const result = removeUrl(uniqueId);
    res.json(result);
});

router.get('/list', (req, res) => {
    const urls = listUrls();
    res.json(urls);
});

// Replace module.exports with export default
export default router;
