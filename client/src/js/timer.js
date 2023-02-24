const timer = (duration) => {
    let timer = duration;
    setInterval(function () {
        let minutes = parseInt(timer / 60, 10);
        let seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        const minutesEle = document.getElementById("minutes"),
                secondEle = document.getElementById("seconds");

        minutesEle.innerText = minutes,
        secondEle.innerText = seconds;

        if(timer <= 30){
            minutesEle.style.color = "red";
            secondEle.style.color = "red";
        }

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);

}

export {timer};