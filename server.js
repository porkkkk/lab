import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

const PORT = process.env.PORT || 3000;

/*
=========================================================
OPENAI
=========================================================

DO NOT PUT YOUR API KEY HERE.

Add this environment variable in your hosting provider:

OPENAI_API_KEY=your_api_key_here

=========================================================
*/

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/*
=========================================================
MIDDLEWARE
=========================================================
*/

app.use(
    cors({
        origin: [
            "https://porkkkk.github.io"
        ],
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type"]
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);


/*
=========================================================
HOME / HEALTH CHECK
=========================================================
*/

app.get("/", (req, res) => {

    res.json({
        status: "online",
        name: "Python Practical AI",
        message: "Backend is working."
    });

});


/*
=========================================================
HEALTH CHECK
=========================================================
*/

app.get("/health", (req, res) => {

    res.json({
        online: true
    });

});


/*
=========================================================
PYTHON PRACTICAL AI INSTRUCTIONS
=========================================================
*/

const SYSTEM_PROMPT = `

You are Python Practical AI.

Your job is to help a college student prepare for a Python
practical examination.

The student mainly needs application-level Python programs.

The student may ask for ANY Python practical problem.

Examples include:

Student Management System
Hospital Management System
Employee Management System
Bank Management System
Library Management System
Hotel Management System
Inventory Management System
Shop Billing System
Bus Reservation System
Contact Book
Attendance System
Student Mark System
Result System
Salary Calculator
Electricity Billing
Parking Management
Restaurant Management
Vehicle Management
Payroll System
Patient Management
Book Management

Do NOT limit answers to these examples.

Understand the user's actual question.

=========================================================
IMPORTANT ANSWER FORMAT
=========================================================

When the user asks for a practical program, normally give:

# AIM

Explain the aim in simple language.

# ALGORITHM / STEPS

Give clear numbered steps.

# PYTHON PROGRAM

Give complete runnable Python 3 code.

Always put Python code inside:

\`\`\`python

code

\`\`\`

# SAMPLE OUTPUT

Show a realistic sample output.

# VIVA QUESTIONS

Give useful viva questions and short answers.

=========================================================
CODE RULES
=========================================================

The student is preparing for a practical examination.

Keep code:

- Simple
- Easy to understand
- Easy to write in an exam
- Complete
- Runnable
- Python 3 compatible

Prefer basic Python concepts:

input()
print()
variables
if
elif
else
for
while
list
dictionary
tuple
functions

Use classes only when the user specifically asks for OOP/classes.

For management systems, menu-driven programs are preferred.

Avoid unnecessary external libraries.

Do not make simple programs unnecessarily complicated.

=========================================================
APPLICATION LEVEL
=========================================================

If the user asks:

"Create hospital management"

Make a practical application with meaningful features.

For example:

1. Add patient
2. Display patient
3. Search patient
4. Update patient
5. Delete patient
6. Exit

Use list/dictionary where appropriate.

If the user asks for a different feature, add it.

=========================================================
MODIFICATION QUESTIONS
=========================================================

If the user says:

"Add delete"

"Add update"

"Add search"

"Add login"

"Add database"

"Add file handling"

"Use functions"

"Use class"

"Make it simple"

Modify the previous program accordingly.

Preserve existing requested functionality unless the user
specifically asks to remove it.

=========================================================
EXPLANATION
=========================================================

Use simple English.

If the user asks Malayalam, explain in simple Malayalam.

If the user asks Hindi, explain in Hindi.

If the user asks only code, give ONLY code.

If the user asks only AIM, give only AIM.

If the user asks only algorithm, give only algorithm.

=========================================================
CODE DOWNLOAD
=========================================================

When giving Python code, always use a fenced Python block:

\`\`\`python
...
\`\`\`

Do not put unrelated text inside the code block.

=========================================================
IMPORTANT
=========================================================

Never claim that code was executed unless it was actually
executed.

If the user asks for sample output, clearly label it as
SAMPLE OUTPUT.

If a requirement is unclear, make a reasonable simple
assumption and mention the assumption briefly.

`;


/*
=========================================================
CLEAN HISTORY
=========================================================
*/

function cleanHistory(history) {

    if (!Array.isArray(history)) {
        return [];
    }

    return history
        .filter(item => {

            return (
                item &&
                (
                    item.role === "user" ||
                    item.role === "assistant"
                ) &&
                typeof item.content === "string"
            );

        })
        .slice(-12);
}


/*
=========================================================
CHAT API
=========================================================
*/

app.post("/api/chat", async (req, res) => {

    try {

        const message =
            typeof req.body.message === "string"
                ? req.body.message.trim()
                : "";


        if (!message) {

            return res.status(400).json({

                error: "Message is required."

            });

        }


        const history =
            cleanHistory(req.body.history);


        /*
        Build conversation.
        */

        const input = [

            {
                role: "system",
                content: SYSTEM_PROMPT
            },

            ...history,

            {
                role: "user",
                content: message
            }

        ];


        /*
        =================================================
        OPENAI REQUEST
        =================================================
        */

        const response =
            await client.responses.create({

                /*
                Use a model available to your API account.

                If this model is not available in your account,
                replace it with an available model.
                */

                model: "gpt-5.6",

                input: input

            });


        /*
        =================================================
        GET ANSWER
        =================================================
        */

        const answer =
            response.output_text ||
            "Sorry, I could not generate an answer.";


        /*
        =================================================
        SEND TO FRONTEND
        =================================================
        */

        return res.json({

            answer: answer

        });


    } catch (error) {

        console.error(
            "================================"
        );

        console.error(
            "OPENAI ERROR:"
        );

        console.error(error);

        console.error(
            "================================"
        );


        return res.status(500).json({

            error:
                error?.message ||
                "AI request failed."

        });

    }

});


/*
=========================================================
404
=========================================================
*/

app.use((req, res) => {

    res.status(404).json({

        error: "Endpoint not found."

    });

});


/*
=========================================================
START SERVER
=========================================================
*/

app.listen(PORT, () => {

    console.log("");
    console.log(
        "=========================================="
    );

    console.log(
        "🐍 Python Practical AI"
    );

    console.log(
        "=========================================="
    );

    console.log(
        `Server running on port ${PORT}`
    );

    console.log(
        "API endpoint:"
    );

    console.log(
        `/api/chat`
    );

    console.log(
        "=========================================="
    );

});
