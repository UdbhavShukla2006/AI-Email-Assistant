async function analyzeEmail() {

    const email = document.getElementById("email").value.trim();

    const language =
        document.getElementById("language").value;

    if (!email) {
        alert("Please enter an email.");
        return;
    }


    document.getElementById("loading").style.display = "block";

    document.getElementById("results").style.display = "none";


    try {

        const response = await fetch("/analyze", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                language: language
            })

        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(data.error);
        }


        displayResults(data);

    }

    catch (error) {

        alert(
            "Something went wrong:\n" +
            error.message
        );

    }

    finally {

        document.getElementById("loading")
            .style.display = "none";
    }
}


function displayResults(data) {

    document.getElementById("results")
        .style.display = "block";


    document.getElementById("summary")
        .textContent = data.summary || "No summary available.";


    document.getElementById("priority")
        .textContent = data.priority || "Unknown";


    document.getElementById("category")
        .textContent = data.category || "Other";


    document.getElementById("sentiment")
        .textContent = data.sentiment || "Neutral";


    document.getElementById("emailLanguage")
        .textContent = data.language || "Unknown";


    displayList(
        "tasks",
        data.tasks
    );


    displayList(
        "deadlines",
        data.deadlines
    );


    if (data.spam_phishing) {

        document.getElementById("spamStatus")
            .textContent =
            data.spam_phishing.is_suspicious
                ? "⚠️ Suspicious"
                : "✅ Safe";


        document.getElementById("spamReason")
            .textContent =
            data.spam_phishing.reason ||
            "No suspicious indicators detected.";
    }


    displayMeeting(data.meeting);


    document.getElementById("reply")
        .value =
        data.reply || "No reply generated.";
}


function displayList(elementId, items) {

    const list =
        document.getElementById(elementId);

    list.innerHTML = "";


    if (!items || items.length === 0) {

        const li =
            document.createElement("li");

        li.textContent = "None detected.";

        list.appendChild(li);

        return;
    }


    items.forEach(item => {

        const li =
            document.createElement("li");

        li.textContent = item;

        list.appendChild(li);

    });
}


function displayMeeting(meeting) {

    const container =
        document.getElementById("meeting");

    container.innerHTML = "";


    if (!meeting || !meeting.is_meeting) {

        container.innerHTML =
            "<p>No meeting detected.</p>";

        return;
    }


    container.innerHTML = `
        <div class="meeting-box">
            <strong>Meeting detected</strong><br>
            📅 Date: ${meeting.date || "Not specified"}<br>
            ⏰ Time: ${meeting.time || "Not specified"}<br>
            📍 Location: ${meeting.location || "Not specified"}<br>
            📝 Purpose: ${meeting.purpose || "Not specified"}
        </div>
    `;
}


function copyReply() {

    const reply =
        document.getElementById("reply");


    navigator.clipboard.writeText(
        reply.value
    );


    alert("Reply copied!");
}