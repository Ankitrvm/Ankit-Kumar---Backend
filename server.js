const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config({ path: "./.env" });

const { Ads } = require("./models/ads");
const { Companies } = require("./models/companies");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  return res.status(200).send("OK");
});

app.post("/companies", async (req, res, next) => {
  try {
    const newCompany = new Companies({ ...req.body });
    const insertedCompany = await newCompany.save();
    return res.status(201).json(insertedCompany);
  } catch (error) {
    next(error);
  }
});

app.post("/ads", async (req, res, next) => {
  try {
    const newAd = new Ads({ ...req.body });
    const insertedAd = await newAd.save();
    return res.status(201).json(insertedAd);
  } catch (error) {
    next(error);
  }
});

app.get("/search", async (req, res, next) => {
  try {
    const keyword = req.query.keyword ?? "";
    const data = await Companies.aggregate([
      {
        $lookup: {
          from: "ads",
          localField: "_id",
          foreignField: "companyId",
          as: "ads",
        },
      },
      {
        $unwind: "$ads",
      },
      {
        $match: {
          $or: [
            { name: { $regex: `${keyword}`, $options: "i" } },
            {
              "ads.primaryText": {
                $regex: `${keyword}`,
                $options: "i",
              },
            },
            {
              "ads.headline": {
                $regex: `${keyword}`,
                $options: "i",
              },
            },
            {
              "ads.description": {
                $regex: `${keyword}`,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          id: "$ads._id",
          companyName: "$name",
          companyUrl: "$url",
          primaryText: "$ads.primaryText",
          headline: "$ads.headline",
          description: "$ads.description",
          cta: "$ads.cta",
          imageUrl: "$ads.imageUrl",
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).send("Something went wrong!");
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    app.listen(process.env.PORT, () =>
      console.log(`Server started on port ${process.env.PORT}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
