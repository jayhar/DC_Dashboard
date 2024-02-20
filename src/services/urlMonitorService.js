import fetch from 'node-fetch';

let monitoredUrls = [];

function addUrl(url, checkMethod) {
    const uniqueId = `${url}-${checkMethod}`;
    if (!monitoredUrls.find(u => u.uniqueId === uniqueId)) {
        monitoredUrls.push({ uniqueId, url, checkMethod, status: 'Pending', lastChecked: new Date() });
        return { message: "URL added successfully.", url, checkMethod };
    } else {
        return { error: "This URL with the specified check method is already being monitored." };
    }
}

function updateUrlStatus(uniqueId, status) {
    const urlIndex = monitoredUrls.findIndex(url => url.uniqueId === uniqueId);
    if (urlIndex !== -1) {
        monitoredUrls[urlIndex].status = status;
        monitoredUrls[urlIndex].lastChecked = new Date();
        console.log(`Updated ${monitoredUrls[urlIndex].url} to ${status}`);
    } else {
        console.error("Failed to update status: URL not found.", uniqueId);
    }
}

function removeUrl(uniqueId) {
    const index = monitoredUrls.findIndex(u => u.uniqueId === uniqueId);
    if (index !== -1) {
        monitoredUrls.splice(index, 1);
        return { message: "URL removed successfully." };
    } else {
        return { error: "URL not found." };
    }
}

function listUrls() {
    return monitoredUrls;
}

// Replace module.exports with ES Module export syntax
export { addUrl, removeUrl, listUrls, updateUrlStatus };
