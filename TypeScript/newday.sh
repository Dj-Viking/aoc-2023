#! /usr/bin/bash
set -e;

if [ -z $1 ]; then
    echo "ERROR: enter a day number between 1-25 to create a new day workspace";
    echo "usage: sh newday.sh 1";
    exit 1;
fi

DIR="Day$1";
mkdir "$DIR";

pushd $DIR;

# create input files
cat << EOF > input.txt
EOF

cat << EOF > sample.txt
EOF

# create code file
sh ../boilerplate.sh;

popd;