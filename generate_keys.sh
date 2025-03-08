#!/bin/bash
set -e

echo "Generating a 256-bit (32-byte) hex key for encryption..."
ENCRYPTION_KEY=$(openssl rand -hex 32)
echo "Encryption key generated."
echo ENCRYPTION_KEY

echo "Generating a 2048-bit RSA private key..."
openssl genrsa -out private.pem 2048
echo "Private key generated."

echo "Generating the RSA public key..."
openssl rsa -in private.pem -pubout -out public.pem
echo "Public key generated."

# Read the generated keys
PRIVATE_KEY=$(cat private.pem)
PUBLIC_KEY=$(cat public.pem)

# Function to escape newlines for .env storage
escape_newlines() {
  echo "$1" | awk '{printf "%s\\n", $0}'
}

PRIVATE_KEY_ESCAPED=$(escape_newlines "$PRIVATE_KEY")
PUBLIC_KEY_ESCAPED=$(escape_newlines "$PUBLIC_KEY")

# Create .env file if it doesn't exist; you can include other default variables as needed
if [ ! -f .env ]; then
  echo "Creating new .env file..."
  echo "DATABASE_URL=postgres://user:password@db:5432/mydb" > .env
fi

# Update or add ENCRYPTION_KEY in .env
if grep -q "^ENCRYPTION_KEY=" .env; then
  sed -i.bak "s/^ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env
else
  echo "ENCRYPTION_KEY=$ENCRYPTION_KEY" >> .env
fi

# Update or add PRIVATE_KEY in .env
if grep -q "^PRIVATE_KEY=" .env; then
  sed -i.bak "s|^PRIVATE_KEY=.*|PRIVATE_KEY=\"$PRIVATE_KEY_ESCAPED\"|" .env
else
  echo "PRIVATE_KEY=\"$PRIVATE_KEY_ESCAPED\"" >> .env
fi

# Update or add PUBLIC_KEY in .env
if grep -q "^PUBLIC_KEY=" .env; then
  sed -i.bak "s|^PUBLIC_KEY=.*|PUBLIC_KEY=\"$PUBLIC_KEY_ESCAPED\"|" .env
else
  echo "PUBLIC_KEY=\"$PUBLIC_KEY_ESCAPED\"" >> .env
fi

echo "Keys have been written to the .env file."
