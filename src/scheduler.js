import fetch from 'node-fetch';
import cron from 'node-cron';
import dns from 'dns';
import https from 'https';
import {listUrls, updateUrlStatus} from './services/urlMonitorService.js';
import {promisify} from 'util';

const dnsLookup = promisify(dns.lookup);
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});
async function fetchWithBypass(url) {
    const response = await fetch(url, {agent: httpsAgent});
    return response;
}
async function performPingCheck(processedUrl, uniqueId) {
  try {
    // Log the processed URL to verify it's correct
    console.log(`Performing DNS lookup for: ${processedUrl}`);
    const { address } = await dnsLookup(processedUrl);
    console.log(`${processedUrl} resolved to ${address}`);
    updateUrlStatus(uniqueId, `Online - PING`);
  } catch (err) {
    console.error(`Error pinging ${processedUrl}:`, err.message);
    updateUrlStatus(uniqueId, `Error - PING`);
  }
}


async function checkUrlStatus() {
    console.log('Checking URL statuses...');
    let urls = listUrls();

    for (let urlObj of urls) {
        if (urlObj.checkMethod === 'GET') {
            let processedUrl = ensureValidUrl(urlObj.url);
            try {
                // Use fetchWithBypass instead of fetch directly
                const response = await fetchWithBypass(processedUrl);
                updateUrlStatus(urlObj.uniqueId, `${response.status} - GET`);
                console.log(`${processedUrl} responded with status: ${response.status}`);
            } catch (error) {
                console.error(`Error fetching ${processedUrl}:`, error.message);
                updateUrlStatus(urlObj.uniqueId, `Error - GET`);
            }
        } else if (urlObj.checkMethod === 'PING') {
            const processedUrl = sanitizeUrlForPing(urlObj.url);
            await performPingCheck(processedUrl, urlObj.uniqueId);
        }
    }
}

function ensureValidUrl(url) {
    // Only add 'http://' if no protocol is specified
    if (!url.match(/^[a-z]+:\/\//i)) {
        url = 'http://' + url;
    }
    return url;
}

function sanitizeUrlForPing(url) {
    try {
        const hostname = new URL(url).hostname;
        return hostname;
    } catch (error) {
        // Fallback for non-URL strings, assuming they might already be hostnames
        return url.replace(/^https?:\/\//i, "").split('/')[0];
    }
}
cron.schedule('* * * * *', checkUrlStatus);
