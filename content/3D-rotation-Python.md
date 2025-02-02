+++
title = '3D Rotation in Python with quaternions'
date = 2024-04-20T15:55:07+02:00
draft = false
description = "Why and how you should be using quaternions right now"
categories = ["python","graphics"]
math = true
+++

Today, I wanted to share a bit of code that you can use to rotate any 3D vector using Python. 
If you want to read a bit about how the code works, and why quaternions are useful, keep reading. If you are only interested in the code, I have it in full [on my GitHub](https://github.com/PaulStapel/quaternions)

## Quickly, what is a quaternion? 

A quaternion is an extension of the complex numbers into 4 dimensions. Just like how you can describe a rotation in 2D using a complex number, a quaternion can describe rotation in 3D. By defining some rules for multiplication ($i^2 = j^2 = k^2 = ijk = -1$), we get certain properties that make rotation very intuitive. See this [wikipedia article on quaternions](https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation) for more details.  

Here, the $ijk$ component of our 4D-vector represent the real $xyz$-axes of our 3D space. We can thus represent any point in space using only the quaternion component of a 4-vector. If you are wondering what the real part is for then, it is basically a tool to represent rotation about some vector in the $ijk$-space, as we will see in the code. For more argumentation for why this is, see [this video ](https://www.youtube.com/watch?v=d4EgbgTm0Bg) by 3Blue1Brown. 

In general, when given a rotation vector $q$ and some point $v$ you want to rotate, we find that the new location of the point will be given by $v' = qv\overline{q}$. We will go over constructing q in a moment. Note that we are basically rotating $v$ twice by $q$ (both the standard and conjugate of $q$). This should be accounted for with the angle we want to rotate by. This rotation always happens right-handedly around $q$. 

## Why rotate using quaternions? 

To begin with, quaternions are often used within game engines because they provide an easier way to rotate angles. Instead of constructing a matrix, which can sometimes be quite cumbersome, you can simply define the normalised normal vector ($q$) and specify the angle θ. This is often quite intuitive to do. Additionally, computer nerds love runtime and storage efficiency, and it holds true that quaternions work better than matrices in both aspects. Quaternions use 4 numbers for storage (vs 9), and the rotation also requires fewer operations than rotations via Euler angles (rotating through 3 perpendicular circles in 3D). Gimbal locking is also avoided, but because I find that topic incredibly boring, I won't dwell on it further. 

Floating-point errors must also be considered in numerical computations, and you've probably seen how a game animation can stretch or grow a bit too much due to a bug in the graphics. What often happens here is that your rotation matrix isn't properly normalised, and the floating-point errors gradually accumulate until the animation isn't properly bounded anymore. Normalising a matrix can sometimes be quite annoying, but with a vector like a quaternion, it's much easier to do.

Finally, we have a super cool advantage from the fact that we can now distinguish rotations in two ways. Rotating clockwise or counterclockwise is permitted because we can choose the orientation of the rotation vector $q$. We've already seen that it normally rotates in a right-handed manner, but by choosing the vector $−q$, you'll effectively have the same rotation, just counterclockwise. You can easily see that $−qv*−\overline{q}=−(−qv\overline{q})=qv\overline{q}$. The rotation remains the same, but now you have the option to choose how you want to reach the final state. This is incredibly useful for areas like robotics, where, for example, a robot arm can't simply rotate 270 degrees without getting stuck.

## Step by step guide

### Step 1: initialise your variables

We need 3 things for this code to work. Firstly we define a point or array of points (usually making up some object) represented by vectors that we want to rotate. Next, we need the normal vector to the plane we want to rotate about. Lastly, we need the angle of rotation. We will be using the numpy package for our computations and vectorisation. 

IMPORTANT: As we are multiplying our rotation vector twice, we should have our angle be half the angle we want to actually rotate by. 

```Python
import numpy as np

angle = actual_angle/2

point = [x, y, z] 

normal_vector = [x, y, z]

```

### Step 2: 4D-ify your vectors

Having specified our 3D vectors, we will look to turn them into 4D vectors. For our point $v$, we simply add a real part $w$ of 0 at the beginning. Our normal vector should be accounted for using Euler's formula to represent a vector: $$q = e^{(ai+bj+ck)\theta} = cos(\theta) + (ai+bj+ck)*sin(\theta)$$
Where a, b and c are normalised with magnitude 1. The components a, b and c are given by the x, y and z of our normal_vector of course. Combining this, we can define the following function. 

```Python
def turn_4D(point, normal_vector):
	v = [0, point[0], point[1], point[2]]
	
	np.linalg.norm(normal_vector)
	q = [np.cos(angle), normal_vector[0]*np.sin(angle),
	normal_vector[1]*np.sin(angle), normal_vector[2]*np.sin(angle)]
	return v, q

v, q = turn_4D(point, normal_vector)
```


### Step 3: Conjugate q

This step is quite self-explanatory. We simply take the quaternion conjugate the same way you would a complex conjugate. 
```Python
def conjugate(q):
	w,x,y,z = q
	return [w, -x, -y, -z]
```

### Step 4: Define quaternion multiplication

Using the rules stated above, you can multiply the quaternions much the same way you would with normal complex numbers. From our multiplicative rules, we eventually derive the three expressions $ij = -ji = k$ , $jk = -kj = i$ and $ki = -ik = j$. From this, I created the following function. You can check for yourself that this holds. 

```python
def quaternion_mult(q1, q2):
	w1, x1, y1, z1 = q1
	w2, x2, y2, z2 = q2
	w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
    x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2
    y = w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2
    z = w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2
	return [w,x,y,z]
```

### Step 5: Define a function to rotate your vector $v$

Lastly, we combine all of this to create the following function using $v' = qv\overline{q}$

```Python
def quaternion_rotation(v, q):
	sub_product = quaternion_mult(q,v)
	return quaternion_mult(sub_product, conjugate(q))

v_prime = quaternion_rotation(v, q) 
```

Now, you know how to rotate vectors using quaternions. If you need to use this, it can be quite a bit more intuitive than constructing a matrix. I definitely urge you to give this a try! I wrote this code in Python, as it is easy to understand and read. The logic stays the same for other languages, and it shouldn't be all too much work to port this. 

## Signing off, have a lovely day!