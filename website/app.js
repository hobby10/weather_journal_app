/* Global Variables */

let weatherBaseURL =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&zip=";
// 85005    

const apiKeyParam = "&appid=df7fa524b481946e37f01e01a0042569";

// Create a new date instance dynamically with JS
let d = new Date();
let fullDate = (d.getMonth() + 1) + "." + d.getDate() + "." + d.getFullYear();


/* http requests helpers */
const postRequest = async (url = "", data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(data),
    });

    try {
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
};

const getRequest = async (url = "") => {
    const response = await fetch(url);
    try {
        // Transform into JSON
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("error", error);
    }
};

document.getElementById("generate").addEventListener("click", (e) => {
    e.preventDefault();

    if (document.getElementById("zip").value == '') {
        alert('please enter zip code!');
    } else {

        getRequest(weatherBaseURL + document.getElementById("zip").value + apiKeyParam)
            .then((data) => {
                try {
                    let tempInfo;
                    if(typeof data.main === "undefined"){
                        tempInfo = 'sorry, no city with this zip code' ; 
                    }else{
                        tempInfo = data.main.temp ;
                    }

                    postRequest("/weather_data", {
                        date: fullDate,
                        temp: tempInfo,
                        user_data: document.getElementById("feelings").value,
                    });
                } catch (error) {
                    console.log("error", error);
                    document.getElementById("date").innerHTML = ` <i class="fa fa-table" aria-hidden="true"></i>    ${data.date}`;
                    document.getElementById("temp").innerHTML = ` <i class="fa fa-thermometer-three-quarters" aria-hidden="true"></i>   ${error}`;
                    document.getElementById("content").innerHTML = ` <i class="fa fa-info" aria-hidden="true"></i>   ${data.user_data}`;
                }
            })
            .then(async (data) => {
                try {
                    const data = await getRequest("/weather_data");
                    document.getElementById("date").innerHTML = ` <i class="fa fa-table" aria-hidden="true"></i>    ${data.date}`;
                    document.getElementById("temp").innerHTML = ` <i class="fa fa-thermometer-three-quarters" aria-hidden="true"></i>   ${data.temp}`;
                    document.getElementById("content").innerHTML = ` <i class="fa fa-info" aria-hidden="true"></i>   ${data.user_data}`;

                    document.getElementById("feelings").value = '';
                    document.getElementById("zip").value = '';
                } catch (error) {
                    console.log("error", error);
                }
            });

    }
});
