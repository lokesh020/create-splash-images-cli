# create-splash-images-cli for react native 

This is cli tool for generating splash or launch images of various sizes required for react native iOS and android platform and also lauchscreen xml file in android with single command. It automatically generates splash images in the right place. So you don't need put extra effort.

## Major changes :- iOS storyboard file setup with splash images generated (2.0.0)

Now the cli tool also generates storyboard file for iOS with all constraints & image setup. No need to setup LaunchScreen.storyboard file :smiley:

## Installation

Install as global dependency

```bash
$ npm install -g create-splash-images-cli
```

## Usage

Under you react-native project folder in terminal run following command :- 

```bash
$ create-splash-images
```

This cli command will ask for splash img source path

#### Recommended large size splash image for fitting across all the devices (810 × 1440)

```bash
? Please enter a valid splash image path here:-  /Users/admin/Downloads/betterth
anbefore.jpeg 
```

#### generate all splash images in right place as follows:- 

<p>
  <img height="150" src="https://github.com/lokesh020/create-splash-images-cli/blob/master/images/OutputResult.png"></img>
</p> 

#### Please appreciate by giving rating if above cli helps you in reducing effort. :smiley: :heart: :heart: :heart:
