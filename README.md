# Dashboard for SHEMS
## Set up
The repo is structured with a server-side and client-side logic. Run `npm start` on the server and `npm run dev` on my-vite-app

## Functionality
This dashbaord is broken down to various sections
### Dashboard
Shows the overall energy usage trend and the smart plug data for a given day. Currently the overall energy usage data is retrieved from the emerald smart plug app and manually sent to the cloud, which is then used here. Whilst there is no clear and easy way to automate this process due to the limitations of the app, this is a future consideration
### Appliances
This shows the appliance information (on/off) and allows users to toggle between the options. The methods and information for this is retrieved from the idle-device-management container running on taata at localhost:4100 (refer to server.js). This page also shows the idle device time for the household
### Load Disaggregation 
This uses disaggregated mock data. Future work would involve usage of real data 
### Prediction
There are three models being used: Arima, CNN and NeuralProphet and the mock data has been preprocessed

## Future Work
- The UI can be improved to allow for a more seamless experience for the user
- The storage of central meter data (used in overall energy usage) can be automated to avoid the manual updating of the data
- Data visualisation can be improved
- For appliances, implement capabilities to edit the idle device management
- Use realtime data over mock data
- implement a recommender system for user (could use information from power grid to check prices and recommend certain activities to users, like laundry, when prices are low)
