const awstools = require('../public/awstools.js')
require('dotenv').config()


const app = async ()=>{
    // const listOfBuckets=await awstools.s3ListBuckets()
    // console.log(listOfBuckets)
    const testBucket = process.env.TEST_BUCKET
    const listofObjects=await awstools.s3ListObjects(testBucket)
    console.log(listofObjects)
    const reduced = awstools.s3BucketReduce(listofObjects)
    console.log(reduced)
}

app()