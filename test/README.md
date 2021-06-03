## Running test 

All these commands supposed to be run at the root of this repository.

### prepare python enviroment
```
python -m venv test/env
source test/env/bin/activate
pip install -r test/requirements.txt
```

### get cloudformation outputs and save it as json
```
python test/getoutputs.py test/outputs.json
python test/test_send_email.py -o test/outputs.json -c cdk.json
```

## Checking locally if Lambda Function works.

### prepare lambda event data

```
touch test/event.json
```

`echo "{}" > test/event.json` if test with empty event

### prepare enviroment variables used in Lambda Function if needed

```
touch test/setenv.sh
```
set variables like
```
echo "export TABLENAME=util-table" >> test/setenv.sh
```

### prepare python enviroment
```
source test/env/bin/activate
pip install -r lambda/requirements.txt
pip install python-lambda-local
```

### run Lambda Function locally

the function supposed to be `lambda_handler` in the lambda function python module.
```
source setenv.sh
python-lambda-local -f lambda_handler test/lambda/xxxx.py event.json
```
