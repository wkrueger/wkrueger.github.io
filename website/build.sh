yarn build
yarn next export
cd ..
rm -rf docs
mv website/out docs
cd docs
touch .nojekyll