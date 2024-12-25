import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Define a callback to handle the performance metrics
const handleVitals = (metric) => {
  console.log(metric);  // You can replace this with custom handling logic
};

// Call the web-vitals functions with the callback
getCLS(handleVitals);
getFID(handleVitals);
getFCP(handleVitals);
getLCP(handleVitals);
getTTFB(handleVitals);

export default handleVitals;
