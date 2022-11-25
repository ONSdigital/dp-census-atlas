import csv from "csv-parser";
import { createReadStream, writeFileSync } from "fs";

if (process.argv.length < 3) {
  throw "Please supply the ONS Postcode to ONS lookup csv filename.";
}

const rawPostcodeLookupFn = process.argv[2];
const maxSearchReturns = 10;
const postcodeLookups = {
  districts: {},
  firstThree: {},
  firstFour: {},
};

/*
 stream through csv and write lookup files. There are three kinds:

  - postcode district lookups (the bit of the postcode before the first space, e.g. 'E17', 'E9', 'SW11'). This can
    have a variable length. Only the first ten of these are maxSearchReturns, as thats all the user will ever see!

  - first three character lookups (the first three characters of the postcode after spaces are removed). This will
    overlap with the postcode district in many (but not all!) cases - e.g. E17 xxx is a different postcode to E1 7xx,
    but the first three chars of both will be E17. These are needed in case people search for a postcode without using
    a space. NB - logic below ensures there will be no overlaps, so e.g. the first three characters of an E1 7xx
    postcode will point at the district lookup for E17. In this case you'd need four characters to tell the difference.
    Only the first ten of these are maxSearchReturns, as thats all the user will ever see!

  - first four character lookups (the first four characters of the postcode after spaces are removed). This have no
    length restrictions, and will be much larger. In most cases the user will be getting results from these files.
*/
createReadStream(rawPostcodeLookupFn)
  .pipe(csv())
  .on("data", (data) => {
    // ----------------------------------------- postcode district lookups ------------------------------------------ //

    // write at most maxSearchReturns for the pcd dist
    if (!(data.pcd_dist in postcodeLookups.districts)) {
      postcodeLookups.districts[data.pcd_dist] = [];
    }
    if (postcodeLookups.districts[data.pcd_dist].length <= maxSearchReturns) {
      postcodeLookups.districts[data.pcd_dist].push({ pcd: data.pcds, oa: data.oa21 });
    }

    // ----------------------------------------- first three char lookups ------------------------------------------- //

    // if this district has already been written as a three char prefix, remove it from the three char prefixes
    if (data.pcd_dist in postcodeLookups.firstThree) {
      delete postcodeLookups.firstThree[data.pcd_dist];
    }
    // remove space and slice to first three, write at most maxSearchReturns. Don't write if the first three chars
    // are already a pcd district
    const pcdFirstThree = data.pcds.replace(/\s+/g, "").slice(0, 3);
    if (!(pcdFirstThree in postcodeLookups.districts)) {
      if (!(pcdFirstThree in postcodeLookups.firstThree)) {
        postcodeLookups.firstThree[pcdFirstThree] = [];
      }
      if (postcodeLookups.firstThree[pcdFirstThree].length <= maxSearchReturns) {
        postcodeLookups.firstThree[pcdFirstThree].push({ pcd: data.pcds, oa: data.oa21 });
      }
    }

    // ------------------------------------------ first four char lookups ------------------------------------------- //

    // remove space and slice to first four
    const pcdFirstFour = data.pcds.replace(/\s+/g, "").slice(0, 4);
    // write all
    if (!(pcdFirstFour in postcodeLookups.firstFour)) {
      postcodeLookups.firstFour[pcdFirstFour] = [];
    }
    postcodeLookups.firstFour[pcdFirstFour].push({ pcd: data.pcds, oa: data.oa21 });
  })

  // --------------------------------------------------- output ----------------------------------------------------- //

  .on("end", () => {
    console.log("All postcodes loaded and parsed.");
    const n =
      Object.keys(postcodeLookups.districts).length +
      Object.keys(postcodeLookups.firstThree).length +
      Object.keys(postcodeLookups.firstFour).length;
    var i = 1;
    for (const [pcdArea, pcdLkup] of Object.entries(postcodeLookups.districts)) {
      process.stdout.write(`Writing postcode lookup file ${i} of ${n}...\r`);
      writeFileSync(`./output/${pcdArea}.json`, JSON.stringify(pcdLkup));
      i += 1;
    }
    for (const [pcdArea, pcdLkup] of Object.entries(postcodeLookups.firstThree)) {
      process.stdout.write(`Writing postcode lookup file ${i} of ${n}...\r`);
      writeFileSync(`./output/${pcdArea}.json`, JSON.stringify(pcdLkup));
      i += 1;
    }
    for (const [pcdArea, pcdLkup] of Object.entries(postcodeLookups.firstFour)) {
      process.stdout.write(`Writing postcode lookup file ${i} of ${n}...\r`);
      writeFileSync(`./output/${pcdArea}.json`, JSON.stringify(pcdLkup));
      i += 1;
    }
    console.log("\r\n...done!");
  });
