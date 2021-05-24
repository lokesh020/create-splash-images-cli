
import chalk from "chalk";
import fs from "fs-extra";
import jimp from "jimp";
import path from "path";

import getLaunchStoryBoardRawXml from './launchStoryBoard'

const splashImgFileName = "splash_bg";
const xcassetName = "LaunchImage";

const ContentsJson = `{
    "images": [
      {
        "idiom": "universal",
        "filename": "${splashImgFileName}.png",
        "scale": "1x"
      },
      {
        "idiom": "universal",
        "filename": "${splashImgFileName}@2x.png",
        "scale": "2x"
      },
      {
        "idiom": "universal",
        "filename": "${splashImgFileName}@3x.png",
        "scale": "3x"
      }
    ],
    "info": {
      "version": 1,
      "author": "xcode"
    }
  }`;

const launchScreenXml = `<?xml version="1.0" encoding="utf-8"?>
  <RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
      android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="vertical">
      <ImageView android:layout_width="match_parent" android:layout_height="match_parent" android:src="@drawable/${splashImgFileName}" android:scaleType="fitXY" />
  </RelativeLayout>`;



const log = (text, dim = false) => {
    console.log(dim ? chalk.dim(text) : text);
};


export const generateImages = async (absProjectDirPath, splashImgPath, iOSProjectDirPath, androidSrcMainDirPath) => {

    const splashImg = await jimp.read(splashImgPath);

    const images = []

    const width = {
        "@1x": 270,
        "@1,5x": 405,
        "@2x": 540,
        "@3x": 810,
        "@4x": 1080,
    };

    const height = {
        "@1x": 480,
        "@1,5x": 720,
        "@2x": 960,
        "@3x": 1440,
        "@4x": 1920,
    };

    if (androidSrcMainDirPath) {
        const appMainPath = path.resolve(androidSrcMainDirPath)
        const resPath = path.resolve(appMainPath, "res");
        const layoutPath = path.resolve(resPath, "layout");

        fs.ensureDirSync(layoutPath);

        const launchScreenXmlPath = path.resolve(layoutPath, "launch_screen.xml");

        fs.writeFileSync(launchScreenXmlPath, launchScreenXml, "utf-8");

        log(`✨ ${path.relative(absProjectDirPath, launchScreenXmlPath)}`, true);

        images.push(
            {
                filePath: path.resolve(resPath, "drawable-mdpi", splashImgFileName + ".png"),
                width: width["@1x"],
                height: height["@1x"],
            },
            {
                filePath: path.resolve(resPath, "drawable-hdpi", splashImgFileName + ".png"),
                width: width["@1,5x"],
                height: height["@1,5x"],
            },
            {
                filePath: path.resolve(resPath, "drawable-xhdpi", splashImgFileName + ".png"),
                width: width["@2x"],
                height: height["@2x"],
            },
            {
                filePath: path.resolve(resPath, "drawable-xxhdpi", splashImgFileName + ".png"),
                width: width["@3x"],
                height: height["@3x"],
            },
            {
                filePath: path.resolve(
                    resPath,
                    "drawable-xxxhdpi",
                    splashImgFileName + ".png",
                ),
                width: width["@4x"],
                height: height["@4x"],
            },
        );

    }

    if (iOSProjectDirPath) {

        const launchStoryBoardPath = path.resolve(iOSProjectDirPath, "LaunchScreen.storyboard");

        const launchStoryBoardRawXml = getLaunchStoryBoardRawXml()

        fs.writeFileSync(launchStoryBoardPath, launchStoryBoardRawXml , "utf-8");

        log(`✨ ${path.relative(absProjectDirPath, launchStoryBoardPath)}`, true);

        const imagesPath = path.join(iOSProjectDirPath, "Images.xcassets");

        if (fs.existsSync(imagesPath)) {

            const imageSetPath = path.resolve(imagesPath, xcassetName + ".imageset");

            fs.ensureDirSync(imageSetPath);

            fs.writeFileSync(
                path.resolve(imageSetPath, "Contents.json"),
                ContentsJson,
                "utf-8",
            );

            images.push(
                {
                    filePath: path.resolve(imageSetPath, splashImgFileName + ".png"),
                    width: width["@1x"],
                    height: height["@1x"],
                },
                {
                    filePath: path.resolve(imageSetPath, splashImgFileName + "@2x.png"),
                    width: width["@2x"],
                    height: height["@2x"],
                },
                {
                    filePath: path.resolve(imageSetPath, splashImgFileName + "@3x.png"),
                    width: width["@3x"],
                    height: height["@3x"],
                },
            );
        } else {
            log(
                `No "${imagesPath}" directory found. Skipping iOS images generation…`,
            );
        }

    }

    await Promise.all(
        images.map(({ filePath, width, height }) =>
            splashImg
                .clone()
                .scaleToFit(width, height)
                .writeAsync(filePath)
                .then(() => {
                    log(
                        `✨  ${path.relative(
                            absProjectDirPath,
                            filePath,
                        )} (${width}x${height})`,
                        true,
                    );
                }),
        ),
    );

    log(
        `✅  Done! Thanks for using ${chalk.underline("create-splash-images-cli")}.`,
      );

}
