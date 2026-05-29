# Sentimetra Pro — Enterprise NLP & Sentiment Intelligence Studio

Sentimetra Pro is a production-grade NLP and Sentiment Analysis Studio designed to handle high-performance customer feedback metrics, automated reviews auditing, toxicity mitigation, and custom machine learning classifications entirely with clean native heuristics and classical ML algorithms.

---

## 🎨 Visual Identity & Architecture

- **Glassmorphic UI**: Elegant deep-slate aesthetics featuring beautiful layout balances, dynamic negative spacing, and sharp visual components.
- **Responsive Workspace**: Clean side navigation layout adapts smoothly from ultra-wide enterprise settings to lightweight touch devices.
- **Privacy First, Local Heuristics**: Zero cloud leaks. The core analysis pipeline is run purely on secure, local high-speed algorithms ensuring lightning-fast execution times.

---

## ⚡ Core Technical Features

### 1. Real-Time Playground
Type or paste custom reviews, email feedback, or product comments to retrieve immediate semantic mappings:
- **Sentiment Weighting**: Interactive, visual breakdown of each word's contribution (using custom SHAP-like coefficients).
- **Abuse & Toxicity Radar**: Automatically flags negative behavior, abusive segments, insults, and extreme patterns.
- **Linguistic Mappings**: Highlights parts of speech, punctuation counts, and intense exclamation flags.

### 2. Live Supervised Model Training Suite
Interactive visual playground for testing and training machine learning models on custom text holdout splits:
- **Algorithms Supported**:
  - **Multinomial Naive Bayes (Bag of Words)**: Highly responsive classifier optimized for word-count probabilities.
  - **SGD Logistic Regression**: Powerful optimization engine featuring adjustable learning rates, epochs, and parameters.
- **Performance Evaluation**: Returns live training step terminal logs, confusion metrics, precision ratios, recall matrices, and F1 calculations.

### 3. High-Throughput CSV Batch Portal
Enables parallel bulk evaluation of customer datasets:
- **Drag & Drop Integration**: Upload custom CSV spreadsheets or load high-fidelity pre-configured datasets.
- **Distribution Mappings**: Real-time interactive charts illustrating negative, neutral, and positive distribution percentages.
- **Anti-Spam Filter**: Automates the detection of repeated promo keywords, suspicious URLs, and suspicious bot-like signatures.

### 4. REST Sandbox Client
Complete mock API console and pipeline documentation for enterprise developers:
- **Interactive POST Client**: Execute sandbox payloads to preview JSON response payloads.
- **Multi-language SDK Snippets**: High-fidelity code exports for `NodeJS`, `Python (Requests)`, and standard `cURL`.

---

## 🛠️ Local Development & Deployment

### Prerequisites
- Node.js (v18.x recommended)
- npm or yarn

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Boot the development workspace:
   ```bash
   npm run dev
   ```
   The local environment binds automatically on http://localhost:3000.

3. Compile the production-optimized build:
   ```bash
   npm run build
   ```

4. Launch the consolidated runtime:
   ```bash
   npm run start
   ```

---

## 🧠 Technologies Built With
- **Frontend Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Interactive Visualization**: Recharts + Lucide Icons + Motion Layouts
- **Backend Routing**: Express Node Server
- **NLP Heuristics**: Tokenization filters, stemmers, TF-IDF weights, Naive Bayes models, Logistic Regression.
