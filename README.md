<p align="center">
    <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" align="center" width="30%">
</p>
<p align="center"><h1 align="center">SIGN-LANGUAGE-RECOGNITION</h1></p>
<p align="center">
	<em><code>❯ uses android smartwatch to detect hand motion using built in accelerometer and gyro and perform sign language detection </code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/ankitpathak2004/Sign-language-recognition?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/ankitpathak2004/Sign-language-recognition?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/ankitpathak2004/Sign-language-recognition?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/ankitpathak2004/Sign-language-recognition?style=default&color=0080ff" alt="repo-language-count">
</p>
<p align="center"><!-- default option, no dependency badges. -->
</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>
<br>

##  Table of Contents

- [ Overview](#-overview)
- [ Features](#-features)
- [ Project Structure](#-project-structure)
  - [ Project Index](#-project-index)
- [ Getting Started](#-getting-started)
  - [ Prerequisites](#-prerequisites)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Testing](#-testing)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)

---

##  Overview

<code>❯ uses RNN model to detect sign lanuage through an android smartwatch(tested with samsung galaxy watch 7) </code>

---

##  Features

<code>❯ realtime detection </code>
<code>❯ dataset creation </code>
<code>❯ doublepoint touch-sdk integration to take sensor data from watch over bluetooth </code>


---

##  Project Structure

```sh
└── Sign-language-recognition/
    ├── compile_model.py
    ├── dataset_creator.py
    ├── gesture_recognition_model.pkl
    ├── model.h5
    ├── output_predictions.csv
    ├── realtime_test.py
    ├── sensor.csv
    ├── static_test.py
    ├── test.csv
    ├── test1.csv
    └── training.csv
```


###  Project Index
<details open>
	<summary><b><code>SIGN-LANGUAGE-RECOGNITION/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/dharshan17sn/Hand-Speaks/blob/master/compile_model.py'>compile_model.py</a></b></td>
				<td><code>❯ train the model </code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/dharshan17sn/Hand-Speaks/blob/master/dataset_creator.py'>dataset_creator.py</a></b></td>
				<td><code>❯ create dataset </code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/dharshan17sn/Hand-Speaks/blob/master/realtime_test.py'>realtime_test.py</a></b></td>
				<td><code>❯ test model on realtime data </code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/dharshan17sn/Hand-Speaks/blob/master/static_test.py'>static_test.py</a></b></td>
				<td><code>❯ test model on static data </code></td>
			</tr>
			</table>
		</blockquote>
	</details>
</details>

---
##  Getting Started

###  Prerequisites

Before getting started with Sign-language-recognition, ensure your runtime environment meets the following requirements:

- **Programming Language:** Python
- **SDK:**Double point touch-sdk
- **Libraries:** tensorflow, numpy,pandas, scikit-learn, scipy, keras


###  Installation

Install Sign-language-recognition using one of the following methods:

**Build from source:**

1. Clone the Sign-language-recognition repository:
```sh
git clone https://github.com/dharshan17sn/Hand-Speaks.git
```

2. Navigate to the project directory:
```sh
cd Sign-language-recognition
```

3. Install the project dependencies:

```sh
pip install tensorflow numpy pandas scikit-learn scipy 
```


###  Usage
sensor.csv already contains data for 2 sign lanugage gestures- hello and thank you
run data_creator.py to create dataset after connecting with android watch
use compile_model.py to create your own model
use static_test.py to test model with static dataset 
use realtime_test.py to test model with realtime data(requires smartwatch connection)




##  Contributing

- **💬 [Join the Discussions](https://github.com/dharshan17sn/Hand-Speaks/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/dharshan17sn/Hand-Speaks/issues)**: Submit bugs found or log feature requests for the `Sign-language-recognition` project.
- **💡 [Submit Pull Requests](https://github.com/dharshan17sn/Hand-Speaks/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/dharshan17sn/Hand-Speaks.git
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/dharshan17sn/Hand-Speaks}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=ankitpathak2004/Sign-language-recognition">
   </a>
</p>
</details>

---




