import json
import psycopg2

# Function to get or create ProductOptionType and return its id
def get_or_create_option_type(cur, name):
    identifier = name.lower()  # Use a normalized name as the identifier
    cur.execute("SELECT id FROM \"ProductOptionType\" WHERE identifier = %s", (identifier,))
    result = cur.fetchone()
    if result:
        return result[0]
    else:
        cur.execute("INSERT INTO \"ProductOptionType\" (name, identifier) VALUES (%s, %s) RETURNING id", (name, identifier))
        return cur.fetchone()[0]

# Insert product options if any
def insert_product_options(cur, product_id, product):
    # List of possible option types, extend this list as needed
    possible_options = ['weight', 'RAM', 'SIZE']

    for option_type in possible_options:
        values = product.get(option_type)  # Use the .get() method to safely access the options
        if values:  # Proceed only if the option exists and is not empty
            type_id = get_or_create_option_type(cur, option_type)
            for value in values:
                cur.execute("INSERT INTO \"ProductOption\" (\"productId\", \"typeId\", value, price) VALUES (%s, %s, %s, %s)", (product_id, type_id, str(value), 0))

def process_products(cur, category_id, sub_category_id, products):
    for product in products:
        # Insert product data
        cleaned_price = clean_price(product['price'])
        cur.execute("""
            INSERT INTO "Product" (name, description, "Brand", price, "imageUrl", "categoryId", "subCategoryId") 
            VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id
            """, (product['productName'], product['description'],product['brand'], cleaned_price, product['catImg'], category_id, sub_category_id))
        product_id = cur.fetchone()[0]

        # Insert product images
        for img in product['productImages']:
            cur.execute('INSERT INTO "ProductImage" ("productId", "imageUrl") VALUES (%s, %s)', (product_id, img))

        # Insert product options
        insert_product_options(cur, product_id, product)
        

def clean_price(price):
    cleaned_price = price.replace(',', '').replace('$', '')
    return float(cleaned_price)


try:
    conn = psycopg2.connect("dbname=postgres user=omer")
    cur = conn.cursor()

    # Load JSON data
    with open('productdata.json', 'r') as file:
        data = json.load(file)

    # Parse the JSON and insert into database
    for category in data:
        # Insert category data
        cur.execute('INSERT INTO "Category" ("name", "image_url") VALUES (%s, %s) ON CONFLICT (name) DO NOTHING RETURNING id', (category['cat_name'], category['image']))
        category_id = cur.fetchone()[0]
        for item in category['items']:
            # Insert subcategory data
            cur.execute('INSERT INTO "SubCategory" (name, "categoryId") VALUES (%s, %s) RETURNING id', (item['cat_name'], category_id))
            sub_category_id = cur.fetchone()[0]
            process_products(cur, category_id, sub_category_id, item['products'])

    conn.commit()
except Exception as e:
    print("Error:", e)
    conn.rollback()
finally:
    if conn:
        conn.close()

    



