
import chalk from "chalk";
import fs from "fs-extra";
import jimp from "jimp";
import path from "path";

const logoFileName = "splash_bg";
const xcassetName = "LaunchImage";

const ContentsJson = `{
    "images": [
      {
        "idiom": "universal",
        "filename": "${logoFileName}.png",
        "scale": "1x"
      },
      {
        "idiom": "universal",
        "filename": "${logoFileName}@2x.png",
        "scale": "2x"
      },
      {
        "idiom": "universal",
        "filename": "${logoFileName}@3x.png",
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
      <ImageView android:layout_width="match_parent" android:layout_height="match_parent" android:src="@drawable/${logoFileName}" android:scaleType="centerCrop" />
  </RelativeLayout>`;

const log = (text, dim = false) => {
    console.log(dim ? chalk.dim(text) : text);
};


export const generateImages = async (workingDirectory, imgPath, iOSProjectPath, androidSrcDirPath) => {

    const splashImg = await jimp.read(imgPath);

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

    if (androidSrcDirPath) {
        const appMainPath = path.resolve(androidSrcDirPath)
        const resPath = path.resolve(appMainPath, "res");
        const layoutPath = path.resolve(resPath, "layout");

        fs.ensureDirSync(layoutPath);

        const launchScreenXmlPath = path.resolve(layoutPath, "launch_screen.xml");

        fs.writeFileSync(launchScreenXmlPath, launchScreenXml, "utf-8");

        log(`${path.relative(workingDirectory, launchScreenXmlPath)}`, true);

        images.push(
            {
                filePath: path.resolve(resPath, "drawable-mdpi", logoFileName + ".png"),
                width: width["@1x"],
                height: height["@1x"],
            },
            {
                filePath: path.resolve(resPath, "drawable-hdpi", logoFileName + ".png"),
                width: width["@1,5x"],
                height: height["@1,5x"],
            },
            {
                filePath: path.resolve(resPath, "drawable-xhdpi", logoFileName + ".png"),
                width: width["@2x"],
                height: height["@2x"],
            },
            {
                filePath: path.resolve(resPath, "drawable-xxhdpi", logoFileName + ".png"),
                width: width["@3x"],
                height: height["@3x"],
            },
            {
                filePath: path.resolve(
                    resPath,
                    "drawable-xxxhdpi",
                    logoFileName + ".png",
                ),
                width: width["@4x"],
                height: height["@4x"],
            },
        );

    }

    if (iOSProjectPath) {
        const imagesPath = path.join(iOSProjectPath, "Images.xcassets");

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
                    filePath: path.resolve(imageSetPath, logoFileName + ".png"),
                    width: width["@1x"],
                    height: height["@1x"],
                },
                {
                    filePath: path.resolve(imageSetPath, logoFileName + "@2x.png"),
                    width: width["@2x"],
                    height: height["@2x"],
                },
                {
                    filePath: path.resolve(imageSetPath, logoFileName + "@3x.png"),
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
                .cover(width, height)
                .writeAsync(filePath)
                .then(() => {
                    log(
                        `✨  ${path.relative(
                            workingDirectory,
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
