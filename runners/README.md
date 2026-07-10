## Runners

This folder includes runners for every language, hosted on AWS Lambda. These runners will run the submitted code, judge it against the testcases passed to the function environment and return the verdicts / results.

I've chosen to go with zip based deployment of these runners on Lambda because these will be lightweight and Lambda cold starts are much faster with zip based deployments if code size < 200 MB.

### How to build and deploy these runners?

I'm taking python as an example here, steps will be similar for other languages.

```
cd python
mkdir package

pip3 install -r requirements.txt --target ./package

cd package
zip -r ../python_runner_deployment .
cd ../

zip python_runner_deployment.zip lambda_function.py
```

We can skip making a package and install the deps at the root of the folder and then zip it but that'd clutter our file tree and make it difficult navigating around the IDE.

### References

- [AWS's guide to working with zip file archives for Python Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html)
- [Deploying Python Lambda functions with container images](https://docs.aws.amazon.com/lambda/latest/dg/python-image.html)
