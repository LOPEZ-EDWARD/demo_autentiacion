const Thing = require('../models/things');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    req.body.thing = JSON.parse(req.body.thing);
    const thing = new Thing({
        title: req.body.thing.title,
        description: req.body.thing.description,
        imageUrl: url + '/images/' + req.file.filename,
        price: req.body.thing.price,
        userId: req.body.thing.userId
    });
    thing.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.modifyThing = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    var imageUrl = '';
    var reqThing = {};
    var deleteImage = false;
    if(req.body.thing == null){
        imageUrl = req.body.imageUrl;
        reqThing = req.body;
    }else{
        imageUrl = url + '/images/' + req.file.filename;
        deleteImage = true;
        reqThing = JSON.parse(req.body.thing);
    }
    const thingUpdate = new Thing({
        _id: req.params.id,
        title: reqThing.title,
        description: reqThing.description,
        imageUrl: imageUrl,
        price: reqThing.price,
        userId: reqThing.userId
    });
    
    Thing.findOne({_id: req.params.id}).then(
        (thing) => {
            if(deleteImage){
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink('images/' + filename, () =>{
                    console.log('Se eliminó el archivo : ' + filename);
                });
            }
            Thing.updateOne({_id: req.params.id}, thingUpdate).then(
                () => {
                    res.status(201).json({
                        message: 'Thing updated successfully!',
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    });
                }
            );
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({_id:req.params.id}).then(
        (thing) => {
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () =>{
                Thing.deleteOne({_id: req.params.id}).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted!'
                        })
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
    
};

exports.getAllStuff = (req, res, next) => {
    Thing.find().then(
        (things) => {
            res.status(200).json(things);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};