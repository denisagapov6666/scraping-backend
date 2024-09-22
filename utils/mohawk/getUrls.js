const axios = require('axios');
const {checkUrl1} = require("../MainCheckUrls");
const site = "mohawk";
const URLModel = require('../../models/urls');
const Product = require('../../models/products');

const { Clog } = require('../utils');

module.exports = async () => {
    Clog.info(site, `Started to monitor ${site}. Fetching urls...`)
    try {
        const URL = "https://core.dxpapi.com/api/v1/core/?&q=*&efq=flooring_type%3A(%22Carpet%22)&rows=20&start=0&search_type=keyword&request_type=search&fl=color_code,sku_thumb_images,product_description,sku_thumb_images,sku_swatch_images,installMethod,room,woodType,wood_type,colors,feature,sku_color,look_visual,collection_name,flooring_type,installation_level,swatch_images,thumb_images,room_scene,manufacturer_url,pid,skuid,title,brand,carpet_types,url,thumb_image,color_name,colorGroup,colorVariation,product_line,look,country_origin,style_name,style_number,searchableFlag&account_id=6677&auth_key=gmtnjthiky37113i&domain_key=mohawkflooring&request_id=7637386574986&_br_uid_2=uid%3D7378009071482%3Av%3D15.0%3Ats%3D1711593819485%3Ahc%3D70&url=https://www.mohawkflooring.com/shop/carpet?colorGroup=all&look=all&type=Carpet&page=2&ref_url=https://www.mohawkflooring.com/";
        const data = await axios.get(URL)
        const docs = data.data.response.docs;
        let count = 0 ;
        const urls = [];

        // generage urls set
        let allUrlModels = await URLModel.find({site}).select('url');
        const allUrlsSet = new Set(allUrlModels.map(urlModel => urlModel.url));
        // and clear the allUrlModels because it can use large memory
        allUrlModels.length = 0;
        allUrlModels = null;

        for (let i = 0; i < docs.length; i++) {
            const element = docs[i].variants;
            for (let j = 0; j < element.length; j++) {
                const styleNumber = element[j].style_number[0];
                const collectionName = element[j].collection_name[0];
                const colorCode = element[j].color_code[0];
                const colorName  = element[j].color_name[0];
                const carpetTypes = element[j].carpet_types[0]
                const productLine = element[j].product_line[0]
                const url = `https://www.mohawkflooring.com/shop/Carpet/detail/${styleNumber}/${collectionName.replace(/ /g,"_")}/${colorCode}/${colorName.replace(/ /g,"_")}?productLine=${productLine.split(" ")[0]}&carpet_types=${carpetTypes}`
                urls.push(url)
                
                if(!allUrlsSet.has(url)){
                    const style = element[j].style_name[0];
                    const productDescription = element[j].product_description[0];
                    const feature = element[j].feature.join(",")
                    const installMethod = element[j].installMethod[0];
                    const productSku = element[j].skuid;
                    const origin = element[j].country_origin[0];
                    const imageUrls = [];
                    imageUrls.push(element[j].sku_thumb_images[0],element[j].sku_swatch_images[0])
                    const newUrlModel = new URLModel({
                        site,
                        url,
                        deleted: false,
                    });
                    await newUrlModel.save();
                    const newUrl = await URLModel.findOne({site,url, new: true });
                    const newProduct = new Product({ 
                        category:"carpet",
                        brandName:productLine,
                        productSku,
                        collection:collectionName,
                        color:colorName,
                        productDescription,
                        style,
                        origin,
                        imageUrls,
                        feature,
                        installMethod,
                        site:"mohawk",
                        url: newUrl._id 
                    });
                    await newProduct.save().then(() => console.log(`${++count} product is saved.`));
                }

            }
            
        }
        const dat = await checkUrl1(site,count,urls);
        return dat;
    } catch (error) {
        Clog.error(site, 'Error fetching URLs:' + error.message);
    }
};

