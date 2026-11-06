import sys

packages = ['lightgbm', 'catboost', 'tabpfn']

for pkg in packages:
    try:
        __import__(pkg)
        print(f'{pkg}: available')
    except ImportError:
        print(f'{pkg}: not available')
