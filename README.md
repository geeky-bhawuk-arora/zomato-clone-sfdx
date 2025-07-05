# 🍽️ Salesforce Zomato Clone

## ✨ Features
- View list of restaurants
- Filter by cuisine and rating
- View menu items
- Place orders (no payments)
- Submit & view reviews
- Order history by customer

---

## ⚡ Technologies Used
- Apex (Server-side logic)
- Lightning Web Components (LWC)
- Custom Objects
- SOQL
- SFDX (Salesforce DX Project)

---

## 📦 How to Deploy

### 1. Pre-Requisites
- Salesforce CLI (SFDX)
- Developer Org or Scratch Org

### 2. Steps to Deploy
```bash
sfdx force:auth:web:login -a ZomatoOrg
sfdx force:org:create -f config/project-scratch-def.json -a zomatoApp -s
sfdx force:source:push -u zomatoApp
```

### 3. Assign Permission Set (if provided)
```bash
sfdx force:user:permset:assign -n Zomato_App_Access
```

### 4. Open Org
```bash
sfdx force:org:open
```

---

## 🔎 Custom Objects
| Object           | Purpose                   |
|------------------|----------------------------|
| Restaurant__c     | Stores restaurant details |
| Menu_Item__c      | Menu items per restaurant |
| Order__c          | Customer orders           |
| Order_Item__c     | Items within an order     |
| Review__c         | Customer reviews          |

---

## 🔄 Components Summary
| Component          | Description                         |
|--------------------|-------------------------------------|
| restaurantList     | Filters and lists restaurants       |
| restaurantDetails  | Shows menu items                    |
| orderCart          | Add-to-cart + place order UI        |
| reviewForm         | Submit review                       |
| reviewList         | Displays reviews for a restaurant   |
| orderHistory       | Customer's past orders              |

---

## 📊 Sample Data
Create sample `Restaurant__c`, `Menu_Item__c`, and `Review__c` records manually or using Apex script in Developer Console.

---



# Salesforce DX Project: Next Steps

Now that you’ve created a Salesforce DX project, what’s next? Here are some documentation resources to get you started.

## How Do You Plan to Deploy Your Changes?

Do you want to deploy a set of changes, or create a self-contained application? Choose a [development model](https://developer.salesforce.com/tools/vscode/en/user-guide/development-models).

## Configure Your Salesforce DX Project

The `sfdx-project.json` file contains useful configuration information for your project. See [Salesforce DX Project Configuration](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_ws_config.htm) in the _Salesforce DX Developer Guide_ for details about this file.

## Read All About It

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Salesforce CLI Command Reference](https://developer.salesforce.com/docs/atlas.en-us.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference.htm)
