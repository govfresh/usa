const req = new XMLHttpRequest();
req.open('GET', 'https://api.congress.gov/v3/bill?api_key=hExsrBBSxIrdS8bwKMuQd3oxFjLMEoIb4YkQZNMx');
req.onload = function () { console.log(JSON.parse(this.response)) };
req.send();