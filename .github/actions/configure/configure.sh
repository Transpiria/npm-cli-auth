function commit_has() {
    local range="$1"
    local pattern="$2"

    git rev-list --format=medium "${range}HEAD" | grep "${pattern}" > /dev/null
}

function increment_version() {
    local last_version="$1"
    local increment_segment="$2"

    local segments=0
    local version=""
    for segment in ${last_version//./ }; do
        segments=$((${segments} + 1))
        if [[ "${segments}" -lt "${increment_segment}" ]]; then
            version+="${segment}".
        elif [[ "${segments}" == "${increment_segment}" ]]; then
            version+="$((${segment} + 1))"
        else
            version+=".0"
        fi
    done

    return_value="${version}"
}

function get_next_version() {
    local last_tag=$(gh release list --json isLatest,tagName --jq '.[] | select(.isLatest) | .tagName')
    echo "Last tag: ${last_tag}"

    local last_version="0.0.0"
    local range=""
    if [ -n "${last_tag}" ]; then
        last_version="${last_tag}"
        range="${last_tag}.."
    fi
    echo "Last version: ${last_version}"

    local segment=3
    if commit_has "${range}" "\[MAJOR\]"; then
        segment=1
    elif commit_has "${range}" "\[MINOR\]"; then
        segment=2
    fi
    increment_version "${last_version}" "${segment}"
    return_value = "${return_value}"
}

function configure() {
    get_next_version
    local version="${return_value}"
    echo "Using version: ${version}"

    npm version --no-git-tag-version "${version}"
    echo "version=${version}" >> "${GITHUB_OUTPUT}"
}

configure
