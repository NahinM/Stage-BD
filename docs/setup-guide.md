## Setup Guide

#### 0. Make Sure You Had Setup git and connect your git to github


#### 1. git clone the repo
```
git clone https://github.com/NahinM/Stage-BD.git
```

#### 2. install the packages

go to frontend folder and install the packages (from the client directory of the project)
after that,
go to backend folder and install the packages (from the server directory of the project)

```
cd client
npm i
cd ..
cd server
npm i
```

1. <mark style="background-color: lightblue;">cd ..</mark> will get you back to the main directory,
2. <mark style="background-color: lightblue;">"npm"</mark> -> node package manager and <mark style="background-color: lightblue;">"i"</mark>-> install

==To see the corrent directory use==
```
pwd
```
#### 3. To Run The Project
please use two terminals. You can use git bash if facing any issue.

##### In terminal 1 ->
<mark style="background-color: lightyellow;"> Make sure you are in client directory:-</mark>
<br>check the current directory:
```
pwd
```
run the frontend/client with:
```
npm run dev
```
##### In terminal 2 ->
<mark style="background-color: lightyellow;"> Make sure you are in server directory:-</mark>
<br>check the current directory:
```
pwd
```
run the frontend/client with:
```
npm run dev
```

## !! PLEASE DO NOT WORK ON THE MAIN BRANCH !!
please create your own branchs for your work and create a pull request after <mark style="background-color:red; color:yellow;">committing into your branch<makr>