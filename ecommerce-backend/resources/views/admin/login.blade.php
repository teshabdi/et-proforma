<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>

    {{-- Bootstrap --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet">

    {{-- Font Awesome --}}
    <script src="https://kit.fontawesome.com/4c9f93ac06.js" crossorigin="anonymous"></script>

    <style>
        body {
            background: linear-gradient(120deg, #4e73df, #1cc88a);
            font-family: 'Segoe UI', sans-serif;
        }
        .login-card {
            max-width: 450px;
            margin: 50px auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
        }
        .login-card h4 {
            color: #4e73df;
            font-weight: bold;
        }
        .btn-custom {
            background-color: #4e73df;
            color: white;
        }
        .btn-custom:hover {
            background-color: #3b5bbf;
        }
        .register-link {
            text-align: center;
            margin-top: 15px;
        }
    </style>
</head>
<body>

    <div class="container position-absolute top-50 start-50 translate-middle">
        <div class="login-card">
            <h4><i class="fas fa-user-shield"></i> Admin Login</h4>
            <p class="fw-light">Sign in to access the dashboard.</p>

            {{-- Success Message --}}
            @if($message = session()->pull('status'))
                <div class="alert alert-success">{{ $message }}</div>
            @endif

            {{-- Validation Errors --}}
            @if($errors->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->all() as $error)
                            <li> {{ $error }} </li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('admin.auth') }}" method="POST" class="mt-4">
                @csrf
                <div class="form-group mt-3">
                    <label for="email" class="fw-bold">Email address</label>
                    <input type="email" class="form-control rounded-pill" id="email" name="email" placeholder="Enter email" required>
                </div>
                <div class="form-group mt-3">
                    <label for="password" class="fw-bold">Password</label>
                    <input type="password" class="form-control rounded-pill" id="password" name="password" placeholder="Enter password" required>
                </div>
                
                <div class="d-grid mt-4">
                    <button type="submit" class="btn btn-custom rounded-pill" name="login">
                        <i class="fas fa-sign-in-alt"></i> LOGIN
                    </button>
                </div>
            </form>

            {{-- Register Link --}}
            <div class="register-link">
                <p>Don't have an account? 
                    <a href="{{ route('admin.register') }}" class="text-primary fw-bold">Register here</a>
                </p>
            </div>
        </div>
    </div>

</body>
</html>
