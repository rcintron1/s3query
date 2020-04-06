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
    }
    let isTruncated
    const s3Objects=[]
    console.log("s3ListObjects",bucketName)
    try{
        do {
            const tempVal=await s3.listObjectsV2(params).promise()
            s3Objects.push(...tempVal.Contents)
            isTruncated=tempVal.IsTruncated
            params.StartAfter = tempVal.Contents[tempVal.Contents.length -1].Key
        }while (isTruncated === true)
        
    }catch(e){return {error: e}}
    return s3Objects
}
const s3BucketReduce = (objData)=>{
    console.log("s3BucketReduce",objData)
    listOfObjects = objData.data.filter(record=>{
        console.log("s3BucketReduce-bool",objData.startDate, record.LastModified.toISOString())
        let result =objData.startDate!==undefined? objData.startDate<record.LastModified.toISOString():true
        console.log("startDate",result)
        result = objData.endDate!==undefined?objData.endDate>record.LastModified.toISOString()&&result:result&&true
        console.log("endDate",result)
        return result
    })
    console.log("s3BucketReduce",listOfObjects.length)
    return listOfObjects.reduce((acc, curV, curI, array)=>{
        const value = curV.Key.split(".").slice(-1)[0]
        value in acc?acc[value]+=1:acc[value]=1
        return acc
    },{})
}


const testIAM = ()=>{

}


module.exports = {
    testCreds:testCreds,
    s3ListObjects: s3ListObjects,
    s3ListBuckets: S3ListBuckets,
    s3BucketReduce: s3BucketReduce
}
