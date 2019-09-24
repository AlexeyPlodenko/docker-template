# Installation
Clone the repository.

# Use
example.js:
```javascript
const { DockerTemplate } = require('./src/DockerTemplate');

const dockerfileTpl = new DockerTemplate();
dockerfileTpl.setTemplateFile('./template.dockerfile');
dockerfileTpl.setOutputFile('./Dockerfile');
dockerfileTpl.setVariables({
    'BUILD-FROM': 'FROM ubuntu:latest'
});
dockerfileTpl.process();
```

template.dockerfile:
```dockerfile
%%BUILD-FROM%%

RUN apt-get update && \
    apt-get install -yq software-properties-common

COPY ./resources/ /var/www/
```

In the example above, the class would read the file "template.dockerfile" in the current run directory, replace all strings matching "%%BUILD-FROM%%" with "FROM ubuntu:latest", write the output to the file "Dockerfile" and return it from the output() method.

It is possible to set a template manually by using the setTemplate(templateString) method.

Also if the method setOutputFile() is not used, then nothing will be written, and the processed template will be only returned in the method process().
