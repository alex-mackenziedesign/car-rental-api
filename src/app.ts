import 'dotenv/config'
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import crypto from "crypto";
const app = express();
const port = 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

type AvailabilityParams = {
  method: String;
  pickupdate: String; // Example date format "09/03/2022"
  pickuptime: String; // Example time format "10:00"
  dropoffdate: String;
  dropofftime: String;
  pickuplocationid: Number;
  dropofflocationid: Number;
  vehiclecategorytypeid: Number;
  ageid: Number;
};

app.get("/available", async (req, res) => {
  const params: AvailabilityParams = {
    method: "step2",
    ...req.body,
  };
  res.send(await getAvailability(params))
});

const generateSignature = (text: string, secret: string): string =>
  crypto.createHmac("SHA256", secret).update(text).digest("hex").toUpperCase();

const getAvailability = async (reqParams: AvailabilityParams): Promise<any> => {

  try {
    const response = await axios
      .request({
        method: "post",
        url: `https://apis.rentalcarmanager.com/agent/booking/v3.2/?apikey=${process.env.API_KEY}`,
        data: reqParams,
        headers: {
          signature: generateSignature(JSON.stringify(reqParams), process.env.SECRET),
        },
      });
    return response.data.results;
  } catch (error) {
    return error;
  }
};

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
