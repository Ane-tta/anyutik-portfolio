"use strict";

// remove placeholder
window.onload = () => {
    const preloader = document.querySelector(".preloader");
    const logo = ".preloader-logo";

    gsap.to(logo, {
        rotation: 180,
        duration: 1.8,
        ease: "elastic.in(1, 0.75)",
        onComplete: () => {
            gsap.to(logo, {
                rotation: 0,
                duration: 0.7,
                ease: "elastic.in(1, 0.3)",
                onComplete: () => {
                    gsap.to(logo, {
                        opacity: 0,
                        delay: 0.25
                    });
                    gsap.to(preloader, {
                        height: 0,
                        delay: 1,
                        display: "none",
                        onComplete: () => {
                            const container = document.querySelector(".main-container");
                            container.classList.remove("hidden");
                            container.classList.add("transition-flip-in-right");
                        }
                    });
                }
            });
        }
    });

    // preloader.addEventListener("click", () => {

    //     const container = document.querySelector(".main-container");
    //     container.classList.remove("hidden");
    //     container.classList.add("transition-flip-in-right");
    // });
    // if (preloader) {
    //     preloader.classList.add("hidden");
    // }

    // const container = document.querySelector(".main-container");
    // container.classList.remove("hidden");
    // container.classList.add("transition-flip-in-right");
};

// hover logo
const logo = document.querySelector(".logo img");
logo.addEventListener("mouseover", () => {
    gsap.to(logo, {
        rotation: 180,
        duration: 0.8,
        ease: "elastic.in(1, 0.75)"
    });
});

logo.addEventListener("mouseout", () => {
    gsap.to(logo, {
        rotation: 0,
        duration: 0.7,
        ease: "elastic.in(1, 0.3)"
    });
});

// text animation
const text = "FRONT-END DEVELOPER";
const subtitle = document.querySelector(".subtitle");
const splitText = text.split("");
const typeText = async () => {
    subtitle.innerHTML = "";
    let i = 0;
    while (true) {
        const letter = splitText[i];
        subtitle.append(letter);
        await waitFor(230);

        i++;
        if (i == splitText.length) {
            await waitFor(1020);
            subtitle.innerHTML = "";
            i = 0;
        }
    }
};

const waitFor = (time = 100) => {
    return new Promise(res => setTimeout(() => res(), time));
};
typeText();

// contact form
const formControllers = document.querySelectorAll(".contact-form input:not([type='submit']), .contact-form textarea");
const hasContent = el => el.value.length > 0;
const toggleStyle = (el, animationOptions) => {
    const label = el.nextElementSibling;
    label.classList.toggle("active");

    if (hasContent(el)) { return; }

    if (!gsap) { return; }

    gsap.to(label, animationOptions);
};

formControllers.forEach(controller => {
    controller.addEventListener("focus", event => {
        const animation = {
            y: -20,
            duration: 0.35,
            ease: "back.out(1.4)"
        };
        event.target.classList.remove("error");
        toggleStyle(event.target, animation);
    });

    controller.addEventListener("blur", event => {
        const animation = {
            y: 0,
            duration: 0.35,
            ease: "circ.inOut"
        };
        toggleStyle(event.target, animation);
    });
});

// send form
const form = document.querySelector("form");
form.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(form);
    const incorrectFields = checkForm(formData);
    if (incorrectFields.length) {
        setErrorStyles(incorrectFields);
        return;
    }
    sendForm(formData);
});

const checkForm = formData => {
    const required = ["name", "email", "message"];
    let incorrectFields = [];
    for (var pair of formData.entries()) {
        const key = pair[0];
        if (required.includes(key) && !pair[1].length) {
            incorrectFields = [...incorrectFields, key];
        }
    }
    return incorrectFields;
};

const setErrorStyles = incorrectFields => {
    incorrectFields.forEach(field => {
        const el = document.querySelector(`.contact-form [name=${field}]`);
        el.classList.add("error");
    });
};

const sendForm = async formData => {
    const response = await fetch("/contact", {
        method: "POST",
        body: formData
    });

    const responseClass = `.${response.ok ? "ok" : "error"}-result`;
    const el = document.querySelector(responseClass);
    el.style.display = "flex";

    let tl = gsap.timeline();

    tl.to(".modal", {
        display: "block",
        opacity: 1,
        duration: 1,
        ease: "expo.out"
    });
    tl.to(".modal", {
        display: "none",
        opacity: 0,
        duration: 2,
        ease: "expo.out",
        onComplete: () => {
            el.style.display = "";
        }
    }, "+=1");
};