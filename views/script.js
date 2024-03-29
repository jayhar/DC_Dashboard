document.getElementById('addUrl').addEventListener('click', async () => {
  const urlInput = document.getElementById('urlInput');
  const url = urlInput.value;
  const checkMethod = document.getElementById('checkMethod').value;
  const response = await fetch('/api/urls/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, checkMethod }),
  });
  const data = await response.json();
  console.log(data);
  urlInput.value = ''; // Clear the input field after adding
  fetchUrls(); // Refresh the list immediately after adding
});

async function fetchUrls() {
  const response = await fetch('/api/urls/list');
  const urls = await response.json();
  const listElement = document.getElementById('urlsList');
  listElement.innerHTML = ''; // Clear the list before repopulating

  urls.forEach(urlObj => {
    // Create a container for each URL and its delete button
    const urlContainer = document.createElement('div');

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.onclick = function() {
      deleteUrl(urlObj.uniqueId); // Call the delete function with the uniqueId
    };

    // Add the delete button to the container
    urlContainer.appendChild(deleteBtn);

    // Create a text node for the URL details
    const urlDetails = document.createTextNode(` URL: ${urlObj.url} - Method: ${urlObj.checkMethod} - Status: ${urlObj.status} - Last Checked: ${new Date(urlObj.lastChecked).toLocaleString()} `);

    // Add the URL details to the container after the delete button
    urlContainer.appendChild(urlDetails);

    // Add the container to the list
    listElement.appendChild(urlContainer);
  });
}

async function deleteUrl(uniqueId) {
  const response = await fetch('/api/urls/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uniqueId }),
  });
  const data = await response.json();
  console.log(data.message);
  fetchUrls(); // Refresh the list after deletion
}

// Initiate polling to automatically refresh the list of URLs every 60 seconds
setInterval(fetchUrls, 60000);

// Fetch the initial list of URLs when the page loads
document.addEventListener('DOMContentLoaded', fetchUrls);
