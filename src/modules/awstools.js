const AWS = require('aws-sdk')

const s3 = new AWS.S3
const sts = new AWS.STS
const iam = new AWS.IAM


const testCreds = async ()=>{
    console.log("testingCreds")
    const param = {}
    const identity = await sts.getCallerIdentity(param).promise()
    console.log (identity)
}

const S3ListBuckets = async()=>{
    const params={}
    let buckets
    try{
        buckets = await s3.listBuckets(params).promise()
    }catch (e){return {error: e }}
    return buckets.Buckets
    
}

const s3ListObjects = async (bucketName)=>{
    const params={
        Bucket: bucketName,
        MaxKeys: 500,
        Delimiter: '.',
        Marker: ""
    }
    let isTruncated
    const s3Objects=[]
    try{
        do {
            const tempVal=await s3.listObjects(params).promise()
            s3Objects.push(...tempVal.Contents)
            isTruncated=tempVal.IsTruncated
            params.Marker = s3Objects[-1].Key
        }while (isTruncated === true)
        
    }catch(e){return {error: e}}
    return s3Objects

}


const testIAM = ()=>{

}


module.exports = {
    testCreds:testCreds,
    s3ListObjects: s3ListObjects,
    s3ListBuckets: S3ListBuckets

}
