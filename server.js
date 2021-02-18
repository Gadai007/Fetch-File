const express = require('express')
const app = express()
const formidable = require('formidable')
const fs = require('fs')
const { sequelize } = require('./database/connection')
const { User } = require('./models/User')


app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static(__dirname + '/uploads'))
app.set('view engine', 'ejs')

app.get('/', async (req, res) => {
    const items = await User.findAll()
    res.render('home', {
        posts: items
    })
})

app.post('/file', async (req, res) => {
    let form = formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if(err){
            return res.render('error')
        }

        const file =await User.create(fields)
        Object.entries(files).map((f) => {
            let oldPath = f[1].path
            // let newPath = './uploads/' + Math.floor(Math.random() * 600000) + '_' + f[1].name
            let newPath = './uploads/' +'Resume_'+ Date.now() + f[1].type.replace('application/', '.')
            let rawData = fs.readFileSync(oldPath)
            fs.writeFile(newPath, rawData, function(err){
                if(err) console.log(err)
            })
            file[f[0]] = newPath.replace('./uploads/','') 
        })
        await file.save()
    })
    res.redirect('/')
})


sequelize.sync({ alter: true }).then(() => {
    app.listen(5000, () => {
        console.log('server started on port 5000')
    })
}).catch(err => console.log(err))

// https://drive.google.com/drive/folders/12XjIqpPNfZSsO47U4W_fcQz8yYZUNSpy