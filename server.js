const express = require('express');

const path = require('path');

const dotenv = require('dotenv');
dotenv.config()

// import express from 'express'; // es module syntax

const app = express();

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

