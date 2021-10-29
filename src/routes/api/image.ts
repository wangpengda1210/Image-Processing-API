import express from "express";
import checkRoute from "../../middleware/checkRoute";
import fsUtilities from "../../utilities/fsUtilities";

const imageRouter = express.Router();

// Resize and display image when accessing '/api/images'
imageRouter.get('/', checkRoute, async (req: express.Request, res: express.Response) => {
    const { filename, width, height } = res.locals.queryObject;

    // Check if the image exists, if not, respond 404
    const fileExists = await fsUtilities.checkImageExists(fsUtilities.getFilePath(filename));
    if (fileExists) {
        const thumbnailPath = fsUtilities.getThumbnailPath(filename, width, height);

        // Check if the thumbnail exists, if not, create the thumbnail, if so, display it directly
        const thumbnailExists = await fsUtilities.checkImageExists(thumbnailPath);
        if (!thumbnailExists) {
            fsUtilities.createThumbnail(filename, width, height)
                .then(() => { // Read the image file after the thumbnail is created
                    return fsUtilities.readImage(thumbnailPath);
                })
                .then((image) => {
                    res.type("jpg").send(image);
                })
                .catch((err) => {
                    res.status(500).send("Error when creating thumbnail");
                });
        } else {
            const image = await fsUtilities.readImage(thumbnailPath);
            res.type("jpg").send(image);
        }
    } else {
        res.status(404).send(`The file ${filename}.jpg does not exist`);
    }
});

export default imageRouter;
