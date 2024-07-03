const URLModel = require("../models/urls");
const ProductModel = require("../models/products")
module.exports = async () => {
    // const counts = await URLModel.aggregate([
    //     {
    //         $group: {
    //             _id: {
    //                 site: "$site",
    //                 new: "$new",
    //                 deleted: "$deleted"
    //             },
    //             count: { $sum: 1 }
    //         }
    //     }
    // ]);
    const counts = await ProductModel.aggregate([
        {
            $lookup: {
                from: "urls", 
                localField: "url", 
                foreignField: "_id", 
                as: "urlData" 
            }
        },
        {
            $unwind: {
                path: "$urlData"
            }
        },
        {
            $group: {
                _id: {
                    site: "$site",
                    new: "$urlData.new", 
                    deleted: "$urlData.deleted" 
                },
                count: { $sum: 1 }
            }
        }
    ]);
    const result = counts.reduce((acc, item) => {
        const site = item._id.site;
        const isNew = item._id.new;
        const isDeleted = item._id.deleted;
        const key = `${isNew ? 'new' : ''}${isDeleted ? 'deleted' : ''}${site}Amount`;
    
        acc[key] = item.count;
        return acc;
    }, {});

    return result;

}

