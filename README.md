# Planum Magic API

This is a backend service built with Node, Express, and Firebase to support a front end client for small artistic merchandising company. This version lacks the credentials to affect the original database but may serve as a templatefor other APIs with firebase.

View Hosted Client here:
* [Planum Magic](https://planum-magic.firebaseapp.com/)

## Getting Started and Installing

If you wish to use the project as a template to create your own project, lease follow:
1. Clone this repository
2. Open terminal and type `git clone [git link]`
3. Navigate to project directory using `cd` in terminal
4. Open project in text editor (atom, VS Code, etc.)
5. Type `npm install` in terminal to load node packages
10. To run the program, run $ `npm run start` in terminal
11. The API will now be locally hosted at localhost:3000
12. You can edit the code at this point to be attached to your own backend database. Specifically you'll need to add a firebase.config file.
12. The best way to make an API request will be to use a program such as Postman

## API calls

GET '/posts'
Will get all posts

GET '/post/:postId'
Will get one post by the ID


DELETE '/post/postId'
Will delete a post by the ID

POST '/post/:postId/image'
Will post an image to a whichever post ID

POST '/post'
Will make a post and the format for the JSON is such:
{
  "name": "Gear of Clarity",
  "images": "image/path",
  "link": "https://www.etsy.com/listing/733049738/gear-of-clarity?ref=shop_home_active_3&frs=1",
  "info": "This intuitive piece was channeled with the intention of pulling uncertainty through the gears of clarity, resulting in resulting in a sense of certainty.",
  "price": "75",
  "itemCategory": "painting",
  "featured": "true",
  "available": "true",
  "highEnd": "false"
}


### Prerequisites

You'll need to have node installed

On Mac or Linux terminal issue the commands:

To install Node Version Manager
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
```

To install the most recent node version
```
nvm install node
```

To use that node version
```
nvm use node
```
"Now using node v8.2.0 (npm v5.3.0)" should be printed (in whatever version)


## Deployment Notes

Do note that full RESTful functionality was not implemented to to the lack of need for those functions by the client.

## Built With

* [Express](https://github.com/expressjs/express) - The Routing and performance module used
* [Busboy](https://www.npmjs.com/package/busboy) - For multi-part form data uploads
* [Firebase](https://www.npmjs.com/package/firebase) - Tools and infrastructure for developing firebase apps

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

