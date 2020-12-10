let breedList=document.getElementById("breed-list");//getting the breed list element
let fetchBtn=document.getElementById("fetch-btn");//getting the fetch button
let dogImg=document.getElementById("dog-img");//getting the dog image
let prevBtn=document.getElementById("prev-btn");//getting the previous button
let nextBtn=document.getElementById("next-btn");//getting the next button

let breed="affenpinscher";//default selected breed
let dogImages=[];//array of the dog images of the selected breed
let currIdx=0;//current index of the image to be displayed in the above array
let numDogs=0;//number of dogs of the selected breed
let prevRight=null;//if the previous button that was pressed was right button or not and currently holds null value as no button is pressed as of now

window.addEventListener("load", function(){//handling the event immediately after the window object is loaded i.e. the webpage is laoded

    let xhrRequest=new XMLHttpRequest();//making an xml http request   

    xhrRequest.open("get", "https://dog.ceo/api/breeds/list/all", true);//initilize the xml http request, where the method of request is "get", the link on which the request is sent to get all the breeds is obtained from dog api webiste and true is to indicate that we are making an asynchronous(rest of the code should not wait for the response) request

    xhrRequest.send();//send the request to the server

    xhrRequest.onload=function(){//onload function to be called once the response is recieved

        let jsonResponse=JSON.parse(xhrRequest.response);//parsing the reponse recieved from string format to a json object

        let breeds=jsonResponse.message;//getting the value of the message of the json response 
        let breedsArr=Object.keys(breeds);//getting the keys of the above message object that are the breeds

        for(breed of breedsArr){//iterating on all the breeds        

            if(breeds[breed].length!=0){//if the breed has sub breeds
                
                let optgroup=document.createElement("optgroup");//creating an optgroup element

                optgroup.setAttribute("label", breed);//setting the label attribute of the above optgroup element to the breed

                breedList.appendChild(optgroup);//appending the above optgroup element as a child to the breed list

                for(subBreed of breeds[breed]){//iterating on all the sub breeds of breed

                    let option=document.createElement("option");//creating an option element

                    option.setAttribute("value", breed+"/"+subBreed);//setting the value attribute of the above option element to the intermediate path string i.e. breed/subBreed

                    option.innerText=subBreed;//setting the inner text of the above option element to the subBreed

                    optgroup.appendChild(option);//appending the above option element as a child to the optgroup element

                }

            }
            else{//if the breed has no sub breeds

                let option=document.createElement("option");//creating an option element

                option.setAttribute("value", breed);//setting the value attribute of the above option element to the breed

                option.innerText=breed;//setting the inner text of the above option element to the breed

                breedList.appendChild(option);//appending the above option element as a child to the breed list

            }

        }
       
    }

    xhrRequest.onerror=function(){//on error function to be called in case we have an error while getting the response

        console.log("Error while fetching the resource");//we print a relevant error message and simply return
        return ;

    }

});

function setImage(right){//setImage function for setting the dog image to be displayed

    if(right){//if we are moving towards right i.e. the next button is pressed
    
        currIdx%=numDogs;//getting the in range current index

        if(prevRight || prevRight==null){//if previously the right button was pressed or was null

            dogImg.setAttribute("src", dogImages[currIdx]);//setting the dog image
            currIdx++;//increasing current index

        }
        else{//if previously the left button was pressed

            currIdx+=2;//incrementing current index
            currIdx%=numDogs;//getting the in range current index

            dogImg.setAttribute("src", dogImages[currIdx]);//setting the dog image
            currIdx++;

        }

        prevRight=true;//now the previous button that was pressed will be right        

    }
    else{//if we are moving towards left, i.e. the previous button is pressed  

        // getting the in range current index

        if(currIdx<0){
            currIdx+=numDogs;
        }

        currIdx%=numDogs;

        if(prevRight){//if previously the right button was pressed

            currIdx-=2;//decrementing current index

            if(currIdx<0){//getting the in range current index

                currIdx+=numDogs;
                currIdx%=numDogs;
                
            }            

            dogImg.setAttribute("src", dogImages[currIdx]);//setting the dog image
            currIdx--;//decrementing current index

        }
        else{//if previously the left button was pressed

            dogImg.setAttribute("src", dogImages[currIdx]);//setting the dog image
            currIdx--;//decrementing current index

        }
        
        prevRight=false;//now the previous button that was pressed will be left

    }

}

function getImages(){//getImages function for getting the dog images of the selected breed

    let xhrRequest=new XMLHttpRequest();//making an xml http request

    xhrRequest.open("get", "https://dog.ceo/api/breed/"+breed+"/images", true);//initializing the xml http request, where the method of request is "get", the link on which the request is sent to get all the images of the selected breed is obtained from dog api webite and true indicates that we are making an asynchronous request

    xhrRequest.send();//sending the request to the server

    xhrRequest.onload=function(){//onload function to be called once the repsonse is recieved

        let jsonResponse=JSON.parse(xhrRequest.response);//parsing the response from string format to a json object
        let images=jsonResponse.message;//getting the value of the message of the json response
        
        dogImages=dogImages.slice(0, 0);//emptying the dog images array before it is to be filled with the images of the selected breed

        for(image of images){//iterating on dog images of the selected breed
            dogImages.push(image);//pushing them to the dog images array
        }        

        currIdx=0;//setting the current index as 0(first image of the selected dog breed to be show is present at this index)

        numDogs=dogImages.length;//obtaining the number of dogs of the selected breed

        setImage(true);//setting the dog image and we are are assuming that we are moving towards right(this is the case when neither left nor right button has been pressed to show the image)

    }

    xhrRequest.onerror=function(){//onerror function to be called if there is an error while getting the response

        console.log("Error while fetching the resource");//we print a relevant error message and simply return
        return ;

    }

}

window.addEventListener("load", getImages);//handling the event immediately after the window object has loaded i.e. the webpage has been loaded and we call the getImages function to handle the event

fetchBtn.addEventListener("click", function(){//handing the event when the fetch button is clicked

    breed=breedList.selectedOptions[0].value;//getting the selected breed
    getImages();//getting the images for that breed

});

fetchBtn.addEventListener("mousedown", function(){//handling the event when the fetch button is pressed down

    fetchBtn.style.color="rgb(210, 244, 255)";//setting the color to shade of light green
    fetchBtn.style.backgroundColor="rgb(0, 124, 128)";//setting the background color to shade of dark green

});

fetchBtn.addEventListener("mouseup", function(){//handling the event when the fetch button is released

    fetchBtn.style.color="rgb(0, 124, 128)";//setting the color to shade of dark green
    fetchBtn.style.backgroundColor="rgb(210, 244, 255)";//setting the background color to shade of light green

});

prevBtn.addEventListener("click", function(){//handling the event when the previous button is clicked

    setImage(false);//setting the image to be shown and since we have pressed the left button, so we are passing right value as false

});

prevBtn.addEventListener("mousedown", function(){//handling the event when the previous button is pressed down
    prevBtn.style.color="white";//changing the color to white
});

prevBtn.addEventListener("mouseup", function(){//handling the event when the previous button is released
    prevBtn.style.color="rgb(43, 198, 226)";//changing the color to shade of blue
});

nextBtn.addEventListener("click", function(){//handling the event when the next button is clicked

    setImage(true);//setting the image to be shown and since we have pressed the right button, so we are passing right value as true

});

nextBtn.addEventListener("mousedown", function(){//handling the event when the next button is pressed down
    nextBtn.style.color="white";//changing the color to white
});

nextBtn.addEventListener("mouseup", function(){//handling the event when the next button is released
    nextBtn.style.color="rgb(43, 198, 226)";//changing the color to shade of blue
});

document.addEventListener("keydown", function(event){//handling the event when a key is pressed down

    let keyCode=event.code;//getting the keyCode
    
    if(keyCode[0]=="K"){//getting the key value
        keyCode=keyCode.slice(3, 4);
    }

    if(keyCode=="A" || keyCode=="ArrowLeft"){//in case a valid key was pressed to go to the previous image

        setImage(false);//setting the image to be shown when we are moving towards left
        prevBtn.style.color="white";//changing previous button color to white

    }

    if(keyCode=="D" || keyCode=="ArrowRight"){//in case a valid key was pressed to go the next image

        setImage(true);//setting the image to be shown when we are moving towards right
        nextBtn.style.color="white";//changing next button color to white

    }

});

document.addEventListener("keyup", function(event){//handling the event when a key is released

    let keyCode=event.code;//same as above
    
    if(keyCode[0]=="K"){
        keyCode=keyCode.slice(3, 4);
    }

    if(keyCode=="A" || keyCode=="ArrowLeft"){
        prevBtn.style.color="rgb(43, 198, 226)";//setting the color of the previous button to the original value
    }

    if(keyCode=="D" || keyCode=="ArrowRight"){
        nextBtn.style.color="rgb(43, 198, 226)";//setting the color of the next button to the original value
    }

});