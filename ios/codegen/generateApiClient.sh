
output_directory=$(pwd)/code_gen_output

echo "Outputting to $output_directory"

curl https://api.kupo.social/open-api-spec > spec.json

# npx @openapitools/openapi-generator-cli generate -i spec.json -g swift5 -o $output_directory

