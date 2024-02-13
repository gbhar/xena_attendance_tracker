die () {
    echo
    echo "$*"
    echo
    exit 1
}

file="./gradle.properties"
if [ -f "$file" ] ; then
    export $(cat $file | tr -d '\r')
else
    die "$file not found."
fi

if [ -n "$BUILD_SYSTEM_ROOT" ] ; then
    GRADLEW_PATH=$BUILD_SYSTEM_ROOT/$buildSystemVersion/gradlew
    if [ -f "$GRADLEW_PATH" ] ; then
        chmod +x "$GRADLEW_PATH"
        exec "$GRADLEW_PATH" "$@"
    else
        die "ERROR: Couldn't find gradlew in $GRADLEW_PATH directory.
Please check:
 - BUILD_SYSTEM_ROOT environment variable
 - buildSystemVersion in gradle.properties

For more info see Build System guide:
https://confluence.jnj.com/display/ABBQ/Hyperion+Handbook#HyperionHandbook-BuildSystem"
    fi
else
    die "ERROR: Environment variable "BUILD_SYSTEM_ROOT" is missing
Please check Build System guide:
https://confluence.jnj.com/display/ABBQ/Hyperion+Handbook#HyperionHandbook-BuildSystem"
fi
