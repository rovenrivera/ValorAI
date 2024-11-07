const PORT = 8000
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
require('dotenv').config()
const axios = require('axios')
const fs = require('fs')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const { GoogleAIFileManager } = require('@google/generative-ai/server')


const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY)
const fileManager = new GoogleAIFileManager(process.env.REACT_APP_API_KEY)
app.post('/gemini', async (req, res) => {
    const upload = await axios({
        method: 'get',
        url: req.body.url,
        headers:{
            "Content-Type":"text/html"
        },
    })

    fs.writeFileSync('vlr_page.html', upload.data, err => {
        if (err) {
            console.log("Error")
        }
        else {
        }
    })

    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})

    const response = await fileManager.uploadFile("test.html", {
        mimeType: "text/html",
        displayName: "Requested Web Page",
    })

    const result = await model.generateContent([
        {
            fileData: {
                mimeType: response.file.mimeType,
                fileUri: response.file.uri,
            },
        },
        { text: req.body.message },
    ])

    
    res.send(result.response.text())
})

app.listen(PORT, () => console.log('Listening on port ${PORT}'))