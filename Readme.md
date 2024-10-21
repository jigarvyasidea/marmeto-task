# Responsive Cart Page

## Objective
This project is a functional and responsive cart page built using HTML, CSS, and JavaScript. It dynamically loads cart items from a provided JSON API and provides essential cart features, including quantity updates, item removal, and price calculations. The page is designed to be responsive across mobile, tablet, and desktop devices.

## Design Reference
The design for the cart page follows a pre-defined structure and can be accessed via the [Figma link](https://www.figma.com/design/OyvjOBRzxCEtrdE2bltFu8/L%26D-Traineeship-%3C%3E-L2?node-id=0-1&node-type=canvas&t=ul0gvKb8dPNw4p82-0).

## Features

1. **Dynamic Cart Rendering:**
   - Fetch cart data from the provided [API](https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889) using JavaScript.
   - Dynamically render cart items, displaying product details like:
     - Product image.
     - Title.
     - Price.
     - Quantity input field.
     - Item subtotal (calculated as price * quantity).

2. **Responsive Layout:**
   - The cart page is responsive, working seamlessly across mobile, tablet, and desktop devices.
   - For desktop, it uses a two-column layout, with cart items on the left and cart totals on the right.

3. **Cart Features:**
   - **Update Quantity:** Users can adjust the quantity of items in their cart, with changes dynamically updating the item subtotal and overall total.
   - **Remove Item:** Users can remove items from the cart, which updates the totals in real time.
   - **Check Out Button:** Includes a functional checkout button (without actual payment processing).

4. **Price Calculation:**
   - Dynamically calculate and display the subtotal for each item and the total price for the entire cart.
   - Prices are displayed in Indian Rupees (₹) with appropriate formatting.

5. **Additional Features:**
   - **Loading Animation:** A loading spinner is displayed while cart data is being fetched from the API.
   - **Currency Formatting:** All prices are formatted in INR with commas for easier readability.



## Tech Stack

- **HTML:** For page structure and content.
- **CSS:** To style the page and ensure responsiveness.
- **JavaScript (ES6+):** To fetch data from the API, handle dynamic rendering of cart items, and manage cart functionality.

## How to Run the Project Locally

1. Clone this repository:
   ```bash
   git clone https://github.com/jigarvyasidea/marmeto-task
