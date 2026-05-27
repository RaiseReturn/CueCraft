# CueCraft

> A robust MERN-stack utility for transforming single-line inputs into highly optimized, parameter-rich AI prompts.

**CueCraft** is an engineering tool designed to eliminate prompt fatigue. By taking a simple, single-line objective, the engine automatically expands it into a structured, high-quality prompt complete with system roles, contextual constraints, output formatting, and required parameters.

Built and maintained by the engineering team at [RaiseReturn](https://raisereturn.com) — the automated reporting platform for scaling marketing agencies.

## Features

* **Single-Line Expansion:** Converts basic intents (e.g., "write a blog post") into dense, system-level prompt architectures.
* **Parameter Injection:** Automatically appends formatting rules, tone constraints, and variable placeholders.
* **Full-Stack Architecture:** Built on a lightweight MERN stack for rapid local deployment and fast API response times.
* **Prompt Library:** Save, tag, and manage your highest-performing prompt templates in MongoDB.

## Tech Stack

* **Frontend:** React.js, Tailwind CSS (or your preferred UI library)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)

## Quick Start Local Deployment

### Prerequisites
Ensure you have Node.js and MongoDB installed and running on your local machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RaiseReturn/CueCraft.git
   cd CueCraft
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration
Create a `.env` file in the `server` directory and add your MongoDB connection string and necessary API keys:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cuecraft
# Add your LLM provider API keys below if applicable
OPENAI_API_KEY=your_api_key_here
```

### Running the Application
You can run both the React client and the Node server concurrently. From the root directory (if you have a concurrent script set up) or in separate terminal windows:

**Start the Server:**
```bash
cd server
npm run dev
```

**Start the Client:**
```bash
cd client
npm start
```

The application will be available at http://localhost:3000.

## Architecture Logic
CueCraft operates by parsing the initial string and passing it through a middleware layer that applies a structured template matrix before sending it to the database or external APIs. This ensures that the burstiness and perplexity parameters of the final prompt are mathematically optimized for LLM comprehension.

## Contributing
Contributions, issues, and feature requests are welcome. Feel free to check the issues page if you want to contribute.

## License
This project is open-source and available under the MIT License.
