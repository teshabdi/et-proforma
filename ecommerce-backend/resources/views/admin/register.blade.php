<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Registration - ET Pro-forma</title>

    {{-- Bootstrap CDN --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            background: linear-gradient(120deg, #4e73df, #1cc88a);
            font-family: 'Segoe UI', sans-serif;
        }
        .register-card {
            max-width: 480px;
            margin: 50px auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
        }
        .register-card h2 {
            color: #4e73df;
            font-weight: bold;
            text-align: center;
            margin-bottom: 25px;
        }
        .btn-custom {
            background-color: #4e73df;
            color: white;
        }
        .btn-custom:hover {
            background-color: #3b5bbf;
        }
    </style>
</head>
<body>

    <div class="register-card">
        <h2>ET Pro-forma Registration</h2>

        {{-- Success Message --}}
        @if(session('status'))
            <div class="alert alert-success text-center">
                {{ session('status') }}
            </div>
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

        <form method="POST" action="{{ route('admin.register.post') }}">
            @csrf
            {{-- Name --}}
            <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input type="text" name="name" class="form-control" placeholder="Enter full name" required>
            </div>

            {{-- Email --}}
            <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="Enter email address" required>
            </div>

            {{-- Password --}}
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" placeholder="Enter password" required>
            </div>

            {{-- Confirm Password --}}
            <div class="mb-3">
                <label class="form-label">Confirm Password</label>
                <input type="password" name="password_confirmation" class="form-control" placeholder="Confirm password" required>
            </div>

            {{-- Role Selection --}}
            <div class="mb-3">
                <label class="form-label">Register As</label>
                <select name="role" class="form-select" required>
                    <option value="">Select role...</option>
                    <option value="admin">Admin</option>
                    <option value="supplier">Supplier</option>
                    <option value="producer">Producer</option>
                    <option value="customer">Customer</option>
                </select>
            </div>

            {{-- Submit Button --}}
            <div class="d-grid">
                <button type="submit" class="btn btn-custom">Register</button>
            </div>
        </form>

        {{-- Login Redirect --}}
        <p class="text-center mt-3">
            Already have an account? 
            <a href="{{ route('admin.login') }}" class="text-primary">Login here</a>
        </p>
    </div>

    {{-- Bootstrap JS --}}
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
